import colors from "colors";
import { exit } from "process";

export class MessageLevel {
  static LOW = colors.blue;
  static MEDIUM = colors.yellow;
  static HIGH = colors.red;
  static GOOD = colors.green;
}

export class MessageManager {
  static throw(message: string, level: any, progress = false) {
    if (progress) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(level(message));
    } else console.log(level(`${message}`));

    if (level == MessageLevel.HIGH) {
      exit(1);
    }
  }
}
