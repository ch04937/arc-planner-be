const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { v1 } = require("uuid");

const Users = require("../model/auth-model.js");
const Profile = require("../model/profile-model");
const Alliance = require("../model/alliance.js");

const { createToken, createRefreshToken } = require("../../utils/tokens");

const {
  validateRegistration,
  validateLogin,
} = require("../../middleware/validate-auth");
const { verifyUser } = require("../../middleware/verify-user.js");

const tokenList = {};

router.get("/", verifyUser, async (req, res) => {
  try {
    const data = await Users.getByUserId(req.profile.profileId);
    const response = {
      isMember: data.isMember,
      isLead: data.isLead,
      isOwner: data.isOwner,
      created_at: data.created_at,
      uuid: data.uuid,
      email: data.email,
    };
    res.status(200).json(response);
  } catch (e) {
    res.status(404).json({ message: "Error" });
  }
});

//post register
router.post("/register", validateRegistration, async (req, res) => {
  // implement registration
  let { username, password, email, inGameName } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    username,
    password,
    email,
    password: hashedPassword,
    uuid: v1(),
  };

  try {
    const user = await Users.addNewUser(newUser);
    const token = createToken({
      username: user.username,
    });
    const refreshToken = createRefreshToken({
      username: user.username,
    });
    // add default info
    await Profile.addDefaultProfile(user.userId, inGameName);

    const response = {
      accessToken: token,
      refreshToken: refreshToken,
    };

    tokenList[refreshToken] = response;

    res.status(201).json({
      profile: {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
      },
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (e) {
    res.status(500).json({ message: "unable to add user", e: e });
  }
});

//post login
router.post("/login", validateLogin, async (req, res) => {
  // implement login
  let { userId, password } = req.body;
  try {
    const findUser = await Users.find(userId);
    if (findUser && bcrypt.compareSync(password, findUser.password)) {
      const token = createToken({
        username: findUser.username,
      });
      const refreshToken = createRefreshToken({
        username: findUser.username,
      });

      const response = {
        accessToken: token,
        refreshToken: refreshToken,
      };

      tokenList[refreshToken] = response;

      res.status(201).json({
        profile: {
          uuid: findUser.uuid,
          username: findUser.username,
          email: findUser.email,
        },
        accessToken: token,
        refreshToken: refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ message: `an error occured ${err}` });
  }
});

router.post("/refresh", async (req, res) => {
  const body = req.body;

  if (body.refreshToken && body.refreshToken in tokenList) {
    const token = createToken({ username: body.userId });
    const response = { refreshToken: token };

    tokenList[body.refreshToken].accessToken = token;
    res.status(200).json(response);
  } else {
    res.status(404).json({ message: "invalid request" });
  }
});

module.exports = router;
