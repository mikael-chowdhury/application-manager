import { io, Socket } from "socket.io-client";
import fs from "fs";
import path, { resolve } from "path";
import { MessageLevel, MessageManager } from "./MessageManager";
import { unzipZipFile } from "../util/Unzip";
import { PackageInformation } from "../types/types";
import { FileSizeManager } from "./FileSizeManager";
const ss = require("socket.io-stream");

export class PackageManager {
  static CONNECTION: Socket = undefined as unknown as Socket;

  static async connectToServer(): Promise<void> {
    return new Promise((res, rej) => {
      PackageManager.CONNECTION = io("http://localhost:8080");

      PackageManager.CONNECTION.on("connect", () => {
        res();
      });

      setTimeout(() => {
        rej();
      }, 2000);
    });
  }

  static clearTemp(): Promise<void> {
    return new Promise(async (res, rej) => {
      const temppath = path.join(__dirname, "..", "..", "temp");

      await fs.promises.rm(temppath, {
        recursive: true,
        force: true,
      });

      res();
    });
  }

  static hasValidConnection(): boolean {
    return PackageManager.CONNECTION !== undefined;
  }

  static emitEvent(event: string, obj: object) {
    PackageManager.CONNECTION.emit(event, obj);
  }

  static async isValidPackage(packageName: string): Promise<boolean> {
    return new Promise((res, rej) => {
      if (PackageManager.hasValidConnection()) {
        PackageManager.emitEvent("validifypackage", {
          name: packageName,
        });
        PackageManager.CONNECTION.on(
          "validifypackageresponse",
          (response: boolean) => {
            res(response);
          }
        );
      } else res(false);
    });
  }

  static hasPackageInstalled(packageName: string) {
    const packagesPath = path.join(
      process.env.APPDATA || path.join(__dirname, "..", ".."),
      "zesty",
      "installed-packages",
      packageName
    );

    return fs.existsSync(packagesPath);
  }

  static async installPackage(packageName: string): Promise<void> {
    const timeStart = Date.now();

    if (!PackageManager.hasPackageInstalled(packageName)) {
      return new Promise(async (res, rej) => {
        const tempFolderpath = path.join(__dirname, "..", "..", "temp");

        const tempFilepath = path.join(tempFolderpath, packageName + ".zip");

        if (!fs.existsSync(tempFolderpath)) {
          fs.mkdirSync(tempFolderpath, {
            recursive: true,
          });
        }

        const packagesPath = path.join(
          process.env.APPDATA || path.join(__dirname, "..", ".."),
          "zesty",
          "installed-packages",
          packageName
        );

        let progressInBytes = 0;

        const packageInformation: PackageInformation = await new Promise(
          (finishedObtainingData) => {
            PackageManager.emitEvent("packageproperties", {
              name: packageName,
            });

            PackageManager.CONNECTION.on("packageproperties", (properties) =>
              finishedObtainingData(properties)
            );
          }
        );

        console.log();

        PackageManager.emitEvent("installpackage", {
          name: packageName,
          progressInBytes: progressInBytes,
        });

        await new Promise((finishedInstalling, rejectedInstallation) => {
          let progress = FileSizeManager.getStr(progressInBytes);
          const packagesize = FileSizeManager.getStr(
            packageInformation.packageSize
          );

          ss(PackageManager.CONNECTION).on(
            "installbytestream",
            (stream: fs.ReadStream) => {
              stream.on("data", async (data: Buffer) => {
                MessageManager.throw(
                  "INSTALLING: " +
                    progress +
                    " / " +
                    packagesize +
                    `  |  ${
                      Math.round(
                        (progressInBytes / packageInformation.packageSize) *
                          100 *
                          10 ** 2
                      ) /
                      10 ** 2
                    }%`,
                  MessageLevel.LOW,
                  true
                );

                await fs.promises.appendFile(
                  tempFilepath,
                  Uint8Array.from(data)
                );

                progressInBytes += data.byteLength;
                progress = FileSizeManager.getStr(progressInBytes);
              });

              stream.on("end", () =>
                setTimeout(() => finishedInstalling(null), 5000)
              );

              stream.on("close", () =>
                setTimeout(() => finishedInstalling(null), 5000)
              );
            }
          );
        });

        console.log();
        console.log();

        MessageManager.throw(
          `Finished installing ${path.basename(tempFilepath)}`,
          MessageLevel.MEDIUM
        );

        console.log();

        MessageManager.throw(
          `Extracting zip into package folder...`,
          MessageLevel.MEDIUM
        );

        if (!fs.existsSync(packagesPath)) {
          await fs.promises.mkdir(packagesPath, {
            recursive: true,
          });
        }

        await unzipZipFile(tempFilepath, packagesPath);

        MessageManager.throw("Finished extracting zip.", MessageLevel.MEDIUM);
        MessageManager.throw(
          "Removing temporary zip file...",
          MessageLevel.MEDIUM
        );
        fs.unlinkSync(tempFilepath);
        console.log();
        MessageManager.throw(
          `Finished downloading and extracting package. `,
          MessageLevel.GOOD
        );

        const timeNow = Date.now();

        MessageManager.throw(
          `Installation took a total of ${timeNow - timeStart} seconds`,
          MessageLevel.GOOD
        );
        MessageManager.throw("Exiting CLI...", MessageLevel.GOOD);
        res();
      });
    } else {
      MessageManager.throw(
        'you already have this package installed. To update the package, run the "update" command along with the package name',
        MessageLevel.HIGH
      );
      return;
    }
  }

  static async uninstallPackage(packageName: string): Promise<void> {
    const packagesPath = path.join(
      process.env.APPDATA || path.join(__dirname, "..", ".."),
      "zesty",
      "installed-packages",
      packageName
    );

    if (PackageManager.hasPackageInstalled(packageName)) {
      MessageManager.throw(
        "Uninstalling package files...",
        MessageLevel.MEDIUM
      );
      fs.rmdirSync(packagesPath, {
        recursive: true,
      });
      MessageManager.throw(
        "Successfully Uninstalled package files.",
        MessageLevel.GOOD
      );
      MessageManager.throw("Exiting CLI...", MessageLevel.GOOD);
    } else {
      MessageManager.throw(
        'you don\'t have this package installed yet! To install a package use the "install" command followed by the package name',
        MessageLevel.HIGH
      );
    }
  }
}
