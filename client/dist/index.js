#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const MessageManager_1 = require("./managers/MessageManager");
const CreateCommandManager_1 = require("./util/CreateCommandManager");
(() => __awaiter(void 0, void 0, void 0, function* () {
    MessageManager_1.MessageManager.throw("Loading CLI...", MessageManager_1.MessageLevel.MEDIUM);
    const commandManager = yield (0, CreateCommandManager_1.CreateCommandManager)();
    let args = process_1.default.argv.splice(2);
    const command = args[0];
    args.shift();
    if (commandManager.commandExists(command)) {
        const cmd = commandManager.getCommand(command);
        yield cmd.exec(args);
    }
    else
        MessageManager_1.MessageManager.throw("please specify a valid command!", MessageManager_1.MessageLevel.HIGH);
}))();
