import fs from "fs";
import path, { resolve } from "path";
import { Command } from "../types/types";
import { CommandManager } from "../managers/CommandManager";

export const CreateCommandManager = (): Promise<CommandManager> => {
  return new Promise((res, rej) => {
    const COMMANDDIR = path.join(__dirname, "..", "commands");

    const commands = fs
      .readdirSync(COMMANDDIR)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    let loaded_commands: Command[] = [];

    commands.forEach((command, commandnum) => {
      import(path.join(COMMANDDIR, command)).then((loaded_command) => {
        loaded_commands.push(loaded_command);

        if (commandnum + 1 == commands.length) {
          res(new CommandManager(loaded_commands));
        }
      });
    });
  });
};
