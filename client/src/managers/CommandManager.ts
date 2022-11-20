import { Command } from "../types/types";

export class CommandManager {
  constructor(public commands: Command[]) {}

  getCommand(name: string) {
    return this.commands.find(
      (cmd) => cmd.trigger == name || cmd.aliases.includes(name)
    );
  }

  commandExists(name: string) {
    return this.getCommand(name) != undefined;
  }
}
