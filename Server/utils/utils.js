const jwt = require("jsonwebtoken");
const { updateOne } = require("../utils/db");
require('dotenv').config();


async function jwTokenGen(userid) {
    try {
        const access_token = jwt.sign({ id: userid }, process.env.SECRET, {
            expiresIn: "15min",
        });
        const refresh_token = jwt.sign({ id: userid }, process.env.SECRET, {
            expiresIn: "1d",
        });
        const update = await updateOne("users",
            { _id: userid },
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
module.exports = { jwTokenGen, validateUsername };
