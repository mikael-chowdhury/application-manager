"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
class CommandManager {
    constructor(commands) {
        this.commands = commands;
    }
    getCommand(name) {
        return this.commands.find((cmd) => cmd.trigger == name || cmd.aliases.includes(name));
    }
    commandExists(name) {
        return this.getCommand(name) != undefined;
    }
}
exports.CommandManager = CommandManager;
