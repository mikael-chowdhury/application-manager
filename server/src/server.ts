import { Server } from "socket.io";
import { Package, PackageWithProgress } from "./types/types";
import fs from "fs";
import path from "path";
import { DOWNLOAD_SPEED } from "./config";
const ss = require("socket.io-stream");

const io = new Server();

io.on("connection", (socket) => {
  let packagedata: fs.ReadStream = undefined as unknown as fs.ReadStream;
  let bytearr: Uint8Array = undefined as unknown as Uint8Array;
  let streamprogress = 0;
  let prevchunk: Buffer = undefined as unknown as Buffer;
  let previousBytearr: Uint8Array = undefined as unknown as Buffer;

  let finished: boolean = false;

  socket.on("installpackage", async (_package: PackageWithProgress) => {
    const progress = _package.progressInBytes;

    const pkgpath = path.join(
      __dirname,
      "..",
      "packages",
      path.basename(_package.name),
      path.basename(_package.name) + ".zip"
    );

    if (!packagedata) {
      packagedata = fs.createReadStream(pkgpath);

      packagedata.on("end", () => {
        finished = true;
      });
      packagedata.on("error", (err) => {
        console.log(err);
      });
    }

    const stream = ss.createStream();

    ss(socket).emit("installbytestream", stream);
    packagedata.pipe(stream);
  });

  socket.on("packageproperties", (_package: Package) => {
    const pkgpath = path.join(
      __dirname,
      "..",
      "packages",
      path.basename(_package.name),
      path.basename(_package.name) + ".zip"
    );

    const stats = fs.statSync(pkgpath);

    socket.emit("packageproperties", {
      packageSize: stats.size,
    });
  });

  socket.on("validifypackage", (_package: Package) => {
    const valid = fs.existsSync(
      path.join(__dirname, "..", "packages", path.basename(_package.name))
    );

    socket.emit("validifypackageresponse", valid);
  });
});

io.listen(8080);
