"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unzipZipFile = void 0;
const unzip_stream_1 = __importDefault(require("unzip-stream"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function unzipZipFile(file, out) {
    return fs_extra_1.default.createReadStream(file).pipe(unzip_stream_1.default.Extract({ path: out }));
}
exports.unzipZipFile = unzipZipFile;
