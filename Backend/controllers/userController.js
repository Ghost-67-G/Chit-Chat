const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/userSchema");
const mailsender = require("../utils/nodemailer");
const { verifyEmail } = require("../utils/EmailTemplate");

exports.signUp = async (req, res) => {
  try {
    let userEmail = await User.findOne({ email: req.body.email });
    if (userEmail) {
      res.json({ success: false, message: "User Already Exists" });
    } else {
      try {
        const { name, email, password, pic } = req.body;
        // let user = new User({ name, email, password, profilePicture: pic });
        const token = jsonwebtoken.sign(
          {
            data: { name, email, password, profilePicture: pic },
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        const link = `${process.env.DOMAIN}/verify-email/${token}`;
        const mailOptions = {
          to: email,
          subject: "Please confirm your Email account",
          html: verifyEmail(link),
        };
        mailsender(mailOptions, async function (error, response) {
          if (error) {
            res.json({
              success: false,
              message: "Email can't sent Please try again",
              error: error.message,
            });
          } else {
            // await user.save();
            res.json({ success: true, message: "Email successfully sent" });
          }
        });
        // user,
        // token,
      } catch (error) {
        res.json({
          success: false,
          message: "Some thing went wrong. While Saving User",
          error: error.message,
        });
      }
    }
  } catch (error) {
    res.json({
      error: error.message,
      success: false,
      message: "Some thing went wrong.",
    });
  }
};

exports.verifyemail = async (req, res) => {
  try {
    const token = req.query.token;
    console.log(token);
    jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET,
      async function (err, decoded) {
        if (err) {
          res.status(400).json({
            success: false,
            message:
              "Email verification failed, possibly the link is invalid or expired",
          });
        } else {
          const { name, email, password, profilePicture } = decoded.data;
          let user = new User({ name, email, password, profilePicture });
          // decoded.data.file = getFile(fileRef)
          await user.save();
          res.json({
            success: true,
            message: "Email Verify successfully",
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "Some thing went wrong.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user && (await user.matchPassword(`${password}`))) {
      const token = jsonwebtoken.sign(
        { data: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      res.json({
        success: true,
        user,
        token,
        message: "User Successfully login",
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Password or Email Invalid" });
    }
  } catch (error) {
    res.json({
      error: error.message,
      success: false,
      message: "Some thing went wrong.",
    });
  }
};

exports.searchUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.json({ success: true, users });
};
// exports.googleLogin = async (req, res) => {
//   try {
//     const { data } = await axios.get(
//       "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" +
//         req.body.access_token
//     );
//     let user = await User.findOne({ email: data.email });
//     if (user) {
//       bcrypt.compare(data.id, user.password, function (err, result) {
//         // result == true
//         if (result) {
//           const token = jsonwebtoken.sign(
//             { data: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: "3d" }
//           );
//           res.json({
//             success: true,
//             user,
//             token,
//             message: "User Successfully login",
//           });
//         } else {
//           res.json({
//             success: false,
//             message: "Email already register via email",
//           });
//         }
//       });
//     } else {
//       const user = new User({
//         profilePicture: data.picture,
//         name: data.name,
//         email: data.email,
//         password: data.id,
//         verified: true,
//       });
//       await user.save();
//       jsonwebtoken.sign(
//         { id: user._id },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: "3d",
//         },
//         function (err, Token) {
//           res.json({
//             success: true,
//             user,
//             message: "User Successfully login",
//             token: Token,
//           });
//         }
//       );
//     }
//   } catch (error) {
//     res.json({
//       error: error.message,
//       success: false,
//       message: "Some thing went wrong.",
//     });
//   }
// };

exports.checkSession = (req, res) => {
  try {
    jsonwebtoken.verify(
      req.query.token,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          res.json({
            success: false,
            message: "Session is expired, Please login again",
          });
        } else {
          let user = await User.findById(decoded.data);
          if (user) {
            res.json({
              success: true,
              user,
              message: "User Successfully login",
            });
          }
        }
      }
    );
  } catch (error) {
    res.json({ error: error.message, message: "Some thing went wrong." });
  }
};

// exports.forgetPassword = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (user) {
//       const token = jsonwebtoken.sign(
//         {
//           data: req.body,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "10m" }
//       );
//       const link = `${process.env.DOMAIN}/setnewPassword/${token}`;
//       const mailOptions = {
//         to: req.body.email,
//         subject: "Please confirm your Email account",
//         html:
//           "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
//           link +
//           ">Click here to verify</a>",
//       };
//       mailsender(mailOptions, function (error, response) {
//         if (error) {
//           res.json({
//             success: false,
//             message: "Email can't sent Please try again",
//             error: error.message,
//           });
//         } else {
//           res.json({ success: true, message: "Email successfully sent" });
//         }
//       });
//     } else {
//       res.json({
//         success: false,
//         message: "This email doesn't exist Please Sign up",
//       });
//     }
//   } catch (error) {
//     res.json({ error: error.message, message: "Some thing went wrong." });
//   }
// };

// exports.newPassword = async (req, res) => {
//   try {
//     let token = req.body.token;
//     jsonwebtoken.verify(
//       token,
//       process.env.JWT_SECRET,
//       async function (err, decoded) {
//         if (err) {
//           res.json({
//             success: false,
//             message:
//               "Email verification failed, possibly the link is invalid or expired",
//           });
//         } else {
//           bcrypt.hash(req.body.password, 10).then(async function (hash) {
//             await User.findOneAndUpdate(
//               { email: decoded.data.email },
//               { password: hash }
//             );
//             res.json({
//               success: true,
//               message: "Password is updated successfully",
//             });
//           });
//         }
//       }
//     );
//   } catch (error) {
//     res.json({ error: error.message, message: "Some thing went wrong." });
//   }
// };
