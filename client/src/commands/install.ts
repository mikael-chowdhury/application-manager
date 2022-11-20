import { exit } from "process";
import { MessageLevel, MessageManager } from "../managers/MessageManager";
import { PackageManager } from "../managers/PackageManager";

export const trigger = "install";
export const aliases = ["i"];

export const exec = async (args: string[]) => {
  const _package = args[0];

  if (_package) {
    await PackageManager.connectToServer().catch(() => {
      MessageManager.throw(
        "Could not connect to servers, please check your internet connection and server status.",
        MessageLevel.HIGH
      );
      exit(1);
    });

    const valid = await PackageManager.isValidPackage(_package);

    if (_package && valid) {
      await PackageManager.installPackage(_package);

      PackageManager.CONNECTION.close();
    } else
      MessageManager.throw(
        "either you didn't specify a package or the package you specified doesn't exist!",
        MessageLevel.HIGH
      );
  } else
    MessageManager.throw(
      "either you didn't specify a package or the package you specified doesn't exist!",
      MessageLevel.HIGH
    );
};
