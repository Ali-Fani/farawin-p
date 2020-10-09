const jwt = require("jsonwebtoken");
const { updateOne } = require("../utils/db");
require('dotenv').config();
const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS;

async function jwTokenGen(user) {
    try {
        const access_token = jwt.sign({ id: user._id,isAdmin:user.isAdmin }, process.env.SECRET, {
            expiresIn: "15min",
        });
        const refresh_token = jwt.sign({ id: user._id,isAdmin:user.isAdmin}, process.env.SECRET, {
            expiresIn: "1d",
        });
        const update = await updateOne("users",
            { _id: user._id },
            { refresh_token: refresh_token }
        );
        if (update) {
            return {
                success: true,
                access_token: access_token,
                refresh_token: refresh_token,
            };
        };
        return { success: false };
    } catch (err) {
        console.error(err);
        return;
    }
}
const validateUsername = async (username, res) => {
  if (!username) {
    res.status(400).json({ status: "failed", error: "provide username" });
    return;
  }
  if (username.length <= 3) {
    res
      .status(400)
      .json({ status: "failed", error: "username is too short (<=3)" });
    return;
  }
};
const genHash=async(password)=>{
  const salt=await bcrypt.genSalt(+saltRounds)
  const hashed_password=await bcrypt.hash(password,salt)
  return hashed_password;
}
module.exports = { jwTokenGen, validateUsername,genHash };
