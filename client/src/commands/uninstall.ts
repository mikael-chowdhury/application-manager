import { MessageLevel, MessageManager } from "../managers/MessageManager";
import { PackageManager } from "../managers/PackageManager";

export const trigger = "uninstall";
export const aliases = ["remove"];

export const exec = async (args: string[]) => {
  const _package = args[0];

  await PackageManager.connectToServer();

  if (_package) {
    await PackageManager.uninstallPackage(_package);

    PackageManager.CONNECTION.close();
  } else
    MessageManager.throw(
      "either you didn't specify a package or the package you specified doesn't exist!",
      MessageLevel.HIGH
    );
};
