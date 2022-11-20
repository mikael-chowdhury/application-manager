"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommandManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CommandManager_1 = require("../managers/CommandManager");
const CreateCommandManager = () => {
    return new Promise((res, rej) => {
        const COMMANDDIR = path_1.default.join(__dirname, "..", "commands");
        const commands = fs_1.default
            .readdirSync(COMMANDDIR)
            .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
        let loaded_commands = [];
        commands.forEach((command, commandnum) => {
            Promise.resolve().then(() => __importStar(require(path_1.default.join(COMMANDDIR, command)))).then((loaded_command) => {
                loaded_commands.push(loaded_command);
                if (commandnum + 1 == commands.length) {
                    res(new CommandManager_1.CommandManager(loaded_commands));
                }
            });
        });
    });
};
exports.CreateCommandManager = CreateCommandManager;
