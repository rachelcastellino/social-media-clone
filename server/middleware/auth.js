import jwt from "jsonwebtoken";

// lets non verified user access some API endpoints

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }
    // grabbing token and attaching it to Bearer
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    // proceed to the next step of the function
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
