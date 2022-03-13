const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  console.log("verifying token")
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.HASH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.usr_id = decoded.id;
    console.log(req.usr_id)
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken
};

module.exports = authJwt;