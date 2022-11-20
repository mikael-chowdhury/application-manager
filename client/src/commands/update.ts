import { MessageLevel, MessageManager } from "../managers/MessageManager";
import { PackageManager } from "../managers/PackageManager";

export const trigger = "update";
export const aliases = ["reinstall"];

export const exec = async (args: string[]) => {
  const _package = args[0];

  await PackageManager.connectToServer();

  const valid = await PackageManager.isValidPackage(_package);

  if (_package && valid) {
    await PackageManager.uninstallPackage(_package);
    await PackageManager.installPackage(_package);

    PackageManager.CONNECTION.close();
  } else
    MessageManager.throw(
      "either you didn't specify a package or the package you specified doesn't exist!",
      MessageLevel.HIGH
    );
};
