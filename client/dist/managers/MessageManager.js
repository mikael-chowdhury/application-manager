"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageManager = exports.MessageLevel = void 0;
const colors_1 = __importDefault(require("colors"));
const process_1 = require("process");
class MessageLevel {
}
exports.MessageLevel = MessageLevel;
MessageLevel.LOW = colors_1.default.blue;
MessageLevel.MEDIUM = colors_1.default.yellow;
MessageLevel.HIGH = colors_1.default.red;
MessageLevel.GOOD = colors_1.default.green;
class MessageManager {
    static throw(message, level) {
        console.log(level(`${message}`));
        if (level == MessageLevel.HIGH) {
            (0, process_1.exit)(1);
        }
    }
}
exports.MessageManager = MessageManager;
