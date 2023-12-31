const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/User');
dotenv.config();

const secret = process.env.SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token", token);
    if (token) {
      jwt.verify(token, secret, async (error, decodedData) => {
        if (error) {
          return res.status(401).json({ message: "Error in Token" });
        }
        const existingUser = await User.findById(decodedData?.id);

        if (!existingUser)
          return res.status(404).json({ message: "Wrong User" });
        req.user = existingUser;
        next();
      });
    }
    else {
      return res.status(401).json({ message: "Invalid Token" });
    }

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Error in Token" });
  }
};

module.exports = auth;