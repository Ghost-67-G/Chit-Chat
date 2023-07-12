const nodemailer = require("nodemailer");

module.exports = async (mailOptions, next) => {
  try {
    // let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.SECURE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    transporter.sendMail(mailOptions, (error, response) => {
      next(error, response);
    });
  } catch (error) {
    next(error, "hello");
  }
};
