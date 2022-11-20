import Seven from "node-7z";

export function unzipZipFile(file: string, out: string): Promise<void> {
  return new Promise((res, rej) => {
    const unzipStream = Seven.extractFull(file, out, {
      $progress: true,
    });

    unzipStream.on("end", () => res());
    unzipStream.on("error", (err) => {
      console.error(err);
    });
  });
  // return fs.createReadStream(file).pipe(unzip.Extract({ path: out }));
}
