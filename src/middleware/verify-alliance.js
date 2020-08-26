const Alliance = require("../routes/model/alliance");

async function verifyAlliance(req, res, next) {
  if (req.user.isMember) {
    const data = await Alliance.getUserAlliance(req.profile.profileId);
    req.alliance = data;
    next();
  } else {
    res.status(404).json({ message: "You need to be a member of an alliance" });
  }
}

module.exports = { verifyAlliance };
