import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

/* REGISTER USER */
export const register = async (req, res) => {
  // makes a call to mongoose database
  // req is request body from front end
  // res is response is what we send back to the front end
  try {
    const {
      firstName,
      LastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    //   encryption
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      LastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      // random value
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    //   shows user a status that something has been created
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
// this is not very secure at all but gives you a brief idea
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // using mongoose to find the one with this specified email and fetches data
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "user does not exist." });
    // uses the salt to compare if the same hash
    const isMatch = await bcrypt.compare(password, user.password);
    // validates username and password
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // make sure password doesn't get sent to front end
    delete user.password;
    res.status(500).json({ error: err.message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
