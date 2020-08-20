const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { v1 } = require("uuid");

const Profile = require("../model/profile-model");

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    const newFilename = `${v1()}-${file.originalname}`;
    cb(null, newFilename);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("avatars");

function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // check mime
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: images only");
  }
}

const { verifyUser } = require("../../middleware/verify-user");

// get profile info
router.get("/", verifyUser, async (req, res) => {
  const { userId } = req.user;
  try {
    const profile = await Profile.getProfile(userId);
    res.status(202).json(profile);
  } catch (e) {
    console.log("e", e);
    res.status(404).json({ message: `could not find ${e}`, e: e });
  }
});

// change profile db
router.put("/change", verifyUser, async (req, res) => {
  const changes = req.query;
  const profileId = req.user.userId;
  try {
    const post = await Profile.update(profileId, changes);
    res.status(202).json(post);
  } catch (e) {
    res.status(404).json({ message: `could not find ${e}`, e: e });
  }
});

router.put("/ncc", verifyUser, async (req, res) => {
  const changes = req.body;
  const profileId = req.user.userId;
  try {
    const post = await Profile.update(profileId, changes);
    res.status(202).json(post);
  } catch (e) {
    res.status(404).json({ message: `could not find ${e}`, e: e });
  }
});

router.put("/img/", verifyUser, async (req, res) => {
  const profileId = await Profile.getProfile(req.user.userId);
  upload(req, res, (err) => {
    if (err) {
      console.log("err", err);
      res.status(400).send({ message: err });
    } else {
      if (req.file === undefined) {
        res.status(406).send({ message: "Error: No File Selected" });
      } else {
        const data = {
          originalname: req.file.originalname,
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          path: req.file.path,
          size: req.file.size,
        };
        Profile.saveImg(profileId.profileId, data)
          .then((response) => {
            res.status(201).json(response);
          })
          .catch((e) => {
            console.log("e", e);
            res.status(500).json({
              message: "An Error Occured with saving the image",
              error: e,
            });
          });
      }
    }
  });
});

module.exports = router;
