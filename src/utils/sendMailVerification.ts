import nodemailer from "nodemailer"

const SendMailVerification = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const verifyUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    await transporter.sendMail({
    from: `"Lost & Found" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}
 
export default SendMailVerification;