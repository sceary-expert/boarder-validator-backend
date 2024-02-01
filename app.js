const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());

// Create Nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  },
  debug: true
});

// Generate OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

// POST endpoint to send emails with OTP
app.post("/send-otp", function (req, res) {
  const emails = req.body.emails;
  const emailOtpPairs = [];

  emails.forEach(email => {
    const otp = generateOTP();

    // console.log("otp ", otp);
    // console.log("email ", email);

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP",
      text: `Your OTP is: ${otp}`
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("OTP sent to " + email);
      }
    });

    emailOtpPairs.push({ email, otp });
  });

  res.json(emailOtpPairs);
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});