#!/usr/bin/env node

import process from "process";
import { MessageLevel, MessageManager } from "./managers/MessageManager";
import { PackageManager } from "./managers/PackageManager";
import { Command } from "./types/types";
import { CreateCommandManager } from "./util/CreateCommandManager";

(async () => {
  MessageManager.throw("Loading CLI...", MessageLevel.MEDIUM);

  const commandManager = await CreateCommandManager();

  MessageManager.throw("Clearing Temporary Files...", MessageLevel.MEDIUM);
  await PackageManager.clearTemp();

  let args = process.argv.splice(2);
  const command = args[0];
  args.shift();

  if (commandManager.commandExists(command)) {
    const cmd = commandManager.getCommand(command) as Command;

    await cmd.exec(args);
  } else
    MessageManager.throw("please specify a valid command!", MessageLevel.HIGH);
})();
