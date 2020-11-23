var jwt = require("jsonwebtoken");
const error = require("../utils/error");
const auth = (req, res, next) => {
  let Bearer = req.headers.authorization;
  if (!Bearer) {
	return res.status(403).json(error(1, "authorization token not found"));
  }
  Bearer = Bearer.split(" ")[1];
  try {
  const decoded=jwt.verify(Bearer, process.env.SECRET);

	req.headers['userId']=decoded.userId
  req.headers['isAdmin']=decoded.isAdmin
  } catch (e) {
	return res.status(403).json(error(1, "authorization token not valid"));
  }
  next();
};

module.exports = { isAuth: auth };
