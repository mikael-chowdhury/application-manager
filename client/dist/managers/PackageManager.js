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
exports.PackageManager = void 0;
const socket_io_client_1 = require("socket.io-client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const MessageManager_1 = require("./MessageManager");
const Unzip_1 = require("../util/Unzip");
class PackageManager {
    static connectToServer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                PackageManager.CONNECTION = (0, socket_io_client_1.io)("http://localhost:8080");
                PackageManager.CONNECTION.on("connect", () => {
                    res();
                });
                setTimeout(() => {
                    rej();
                }, 2000);
            });
        });
    }
    static hasValidConnection() {
        return PackageManager.CONNECTION !== undefined;
    }
    static emitEvent(event, obj) {
        PackageManager.CONNECTION.emit(event, obj);
    }
    static isValidPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                if (PackageManager.hasValidConnection()) {
                    PackageManager.emitEvent("validifypackage", {
                        name: packageName,
                    });
                    PackageManager.CONNECTION.on("validifypackageresponse", (response) => {
                        res(response);
                    });
                }
                else
                    res(false);
            });
        });
    }
    static hasPackageInstalled(packageName) {
        const packagesPath = path_1.default.join(process.env.APPDATA || path_1.default.join(__dirname, "..", ".."), "zesty", "installed-packages", packageName);
        return fs_1.default.existsSync(packagesPath);
    }
    static installPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!PackageManager.hasPackageInstalled(packageName)) {
                return new Promise((res, rej) => {
                    const tempFilepath = path_1.default.join(__dirname, "..", "..", "temp", packageName + ".zip");
                    const packagesPath = path_1.default.join(process.env.APPDATA || path_1.default.join(__dirname, "..", ".."), "zesty", "installed-packages", packageName);
                    let progressInBytes = 0;
                    loop();
                    function loop() {
                        PackageManager.CONNECTION.removeAllListeners();
                        PackageManager.emitEvent("installpackage", {
                            name: packageName,
                            progressInBytes: progressInBytes,
                        });
                        PackageManager.CONNECTION.on("installbytestream", (stream) => __awaiter(this, void 0, void 0, function* () {
                            const bytes = stream.binary_chunk;
                            progressInBytes += stream.binary_chunk.byteLength;
                            yield fs_1.default.promises.appendFile(tempFilepath, bytes);
                            console.log(stream.finished);
                            if (!stream.finished) {
                                MessageManager_1.MessageManager.throw("INSTALLING: " + progressInBytes / 1000 + "KB", MessageManager_1.MessageLevel.LOW);
                                loop();
                            }
                            else {
                                MessageManager_1.MessageManager.throw(`Finished installing ${path_1.default.basename(tempFilepath)}`, MessageManager_1.MessageLevel.MEDIUM);
                                MessageManager_1.MessageManager.throw(`Extracting zip into package folder...`, MessageManager_1.MessageLevel.MEDIUM);
                                if (!fs_1.default.existsSync(packagesPath)) {
                                    yield fs_1.default.promises.mkdir(packagesPath, {
                                        recursive: true,
                                    });
                                }
                                const unzipStream = (0, Unzip_1.unzipZipFile)(tempFilepath, packagesPath);
                                unzipStream.on("close", () => __awaiter(this, void 0, void 0, function* () {
                                    MessageManager_1.MessageManager.throw("Finished extracting zip.", MessageManager_1.MessageLevel.MEDIUM);
                                    MessageManager_1.MessageManager.throw("Removing temporary zip file...", MessageManager_1.MessageLevel.LOW);
                                    fs_1.default.unlinkSync(tempFilepath);
                                    MessageManager_1.MessageManager.throw(`Finished downloading and extracting package. `, MessageManager_1.MessageLevel.GOOD);
                                    res();
                                }));
                            }
                        }));
                    }
                });
            }
            else {
                MessageManager_1.MessageManager.throw('you already have this package installed. To update the package, run the "update" command along with the package name', MessageManager_1.MessageLevel.HIGH);
                return;
            }
        });
    }
    static uninstallPackage(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            const packagesPath = path_1.default.join(process.env.APPDATA || path_1.default.join(__dirname, "..", ".."), "zesty", "installed-packages", packageName);
            if (PackageManager.hasPackageInstalled(packageName)) {
                fs_1.default.rmdirSync(packagesPath, {
                    recursive: true,
                });
            }
            else {
                MessageManager_1.MessageManager.throw('you don\'t have this package installed yet! To install a package use the "install" command followed by the package name', MessageManager_1.MessageLevel.HIGH);
            }
        });
    }
}
exports.PackageManager = PackageManager;
PackageManager.CONNECTION = undefined;
