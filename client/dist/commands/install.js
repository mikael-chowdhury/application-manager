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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.aliases = exports.trigger = void 0;
const process_1 = require("process");
const MessageManager_1 = require("../managers/MessageManager");
const PackageManager_1 = require("../managers/PackageManager");
exports.trigger = "install";
exports.aliases = ["i"];
const exec = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const _package = args[0];
    if (_package) {
        yield PackageManager_1.PackageManager.connectToServer().catch(() => {
            MessageManager_1.MessageManager.throw("Could not connect to servers, please check your internet connection and server status.", MessageManager_1.MessageLevel.HIGH);
            (0, process_1.exit)(1);
        });
        const valid = yield PackageManager_1.PackageManager.isValidPackage(_package);
        if (_package && valid) {
            yield PackageManager_1.PackageManager.installPackage(_package);
            PackageManager_1.PackageManager.CONNECTION.close();
        }
        else
            MessageManager_1.MessageManager.throw("either you didn't specify a package or the package you specified doesn't exist!", MessageManager_1.MessageLevel.HIGH);
    }
    else
        MessageManager_1.MessageManager.throw("either you didn't specify a package or the package you specified doesn't exist!", MessageManager_1.MessageLevel.HIGH);
});
exports.exec = exec;
