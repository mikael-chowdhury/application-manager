export type Command = {
  trigger: string;
  aliases: string[];
  exec: (args: string[]) => Promise<void>;
};

export type PackageInformation = {
  packageSize: number;
};
