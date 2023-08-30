import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, __, callback) => {
    const userDir = `./src/uploads/${req.user!.id}`;

    if (!fs.existsSync("./src/uploads")) {
      fs.mkdirSync("./src/uploads");
    }

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir);
    }

    callback(null, userDir);
  },
  filename: (req, file, callback) => {
    const fileName = `${req.user!.id}_${Math.random()
      .toString()
      .replace("0.", "")
      .substring(0, 6)}_${Date.now()}.${file.originalname.split(".").pop()}`;
    req.on("error", () => {
      const dest = `./src/uploads/${req.user!.id}/${fileName}`;
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }
      const err = new Error("Image was not upload");
      err.name = "stop";
      callback(err, fileName);
    });
    callback(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, callback) => {
    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/png" &&
      file.mimetype !== "video/mp4"
    ) {
      callback(null, false);
      const err = new Error("Only .png, .jpg, .jpeg and .mp4 format allowed!");
      err.name = "ExtensionError";
      return callback(err);
    }
    callback(null, true);
  },
}).fields([
  { name: "default", maxCount: 1 },
  { name: "media", maxCount: 8 },
]);

export default upload;
