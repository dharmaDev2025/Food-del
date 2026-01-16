import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, login again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to req.user
    req.user = { id: token_decode.id };

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

export default authMiddleware;
