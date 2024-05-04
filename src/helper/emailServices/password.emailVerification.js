import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import emailVerification from "../../models/emailVerification.js";
import userPasswordReset from "../../models/passwordReset.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();
// Nodemailer
var transporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 2525,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.ELASTIC_PASSWORD,
  },
});

// TESTING TRANSPORTER

transporter.verify((error, message) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Messaging portal is set");
  }
});

// Configuration for Password reset email
export const sendPasswordResetEmail = async (
  { _id, email, first_name },
  res
) => {
  const uniqueString = uuidv4() + _id;
  const redirectUrl = " http://localhost:3000";

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    html: `<p>
    Hi ${first_name}, <br>

 Trouble signing in? <br>
 Resetting your password is easy.

  Just click the link below and follow the instructions. We'll have you up and running in no time.
   <a href="${redirectUrl}/reset-password?userId=${_id}&uniqueString=${uniqueString}">Click here</a>.</p>

  If you did not make this request then please ignore this email. <br>
    
  \n <b>Password reset link expires in 1 hour</b>
      <p>Kind Regards.</p>
`,
  };

  try {
    const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
    const passwordReset = new userPasswordReset({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expireAt: Date.now() + 3600000,
    });

    await passwordReset.save();
    transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "pending",
      message: "Password reset email sent",
    });
  } catch (err) {
    res.status(500).json({
      message:
        "Error occurred during the process of sending password reset email",
    });
  }
};

// Email verification
export const sendVerificationEmail = async (
  { _id, email, first_name },
  res
) => {
  const uniqueString = uuidv4() + _id;
  const redirectUrl = " http://localhost:3000";

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Email Verification",
    html: `<p>Hello ${first_name},<br> You registered an account on 
     <a href="https://www.fsc.com">FSC</a> website, before being able to use your account you need to verify that
      this is your email address by clicking <a href="${redirectUrl}/verify-email?userId=${_id}&uniqueString=${uniqueString}">here</a>.
      </p> \n <b>Verification link expires in 1 hour.</b>
    
    <p>Kind Regards.</p>
    `,
  };

  try {
    const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
    const verification = new emailVerification({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expireAt: Date.now() + 3600000,
    });

    await verification.save();
    transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "pending",
      message: "Verification email sent",
    });
  } catch (err) {
    res.status(500).json({
      message:
        "Error occurred during the process of sending verification email",
    });
  }
};
