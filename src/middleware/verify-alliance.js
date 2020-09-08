const Alliance = require("../routes/model/alliance");

async function verifyAlliance(req, res, next) {
  const alliance = await Alliance.getUserAlliance(req.profile.profileId);
  if (alliance) {
    req.alliance = alliance;
    next();
  } else {
    // verify alliance
    await Alliance.userUpdate(req.user.userId);
    res.status(404).json({ message: "You need to be a member of an alliance" });
  }
}

module.exports = { verifyAlliance };
