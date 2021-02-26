const jwt = require("jsonwebtoken");
const User = require("../routes/User/schema");
const { verifyJWT } = require("./tools");

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await verifyJWT(token);
    const user = await User.findOne({
      _id: decoded._id,
    });
    // qui dico "TROVAMI QUELLO USER CHE HA L'ID UGUALE ALL' ID CERCATO"
    if (!user) throw new Error("NO USER FOUND TR");

    req.user;
    req.token;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { authorize };
