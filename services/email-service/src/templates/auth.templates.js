const verifyEmailTemplate = (otp) => ({
  subject: "Verify Your Email",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="color:#333;">Email Verification</h2>
      <p>Your OTP for verifying your email is:</p>

      <h1 style="letter-spacing: 4px; color:#2c7be5;">${otp}</h1>

      <p>This OTP is valid for <strong>2.5 minutes</strong>.</p>
      <p style="color:#888; font-size:12px;">
        If you did not request this, please ignore this email.
      </p>
    </div>
  `,
});

const forgotPasswordTemplate = (otp) => ({
  subject: "Reset Your Password",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="color:#333;">Password Reset</h2>
      <p>Your OTP for resetting your password is:</p>

      <h1 style="letter-spacing: 4px; color:#e5533d;">${otp}</h1>

      <p>This OTP is valid for <strong>2.5 minutes</strong>.</p>
      <p style="color:#888; font-size:12px;">
        If you did not request a password reset, please secure your account.
      </p>
    </div>
  `,
});

const accountRecoveryTemplate = (otp) => ({
  subject: "Recover Your Account",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2 style="color:#333;">Account Recovery</h2>
      <p>Your OTP to recover your account is:</p>

      <h1 style="letter-spacing: 4px; color:#28a745;">${otp}</h1>

      <p>This OTP is valid for <strong>2.5 minutes</strong>.</p>
      <p style="color:#888; font-size:12px;">
        If you did not request account recovery, please secure your account immediately.
      </p>
    </div>
  `,
});

module.exports = {
  verifyEmailTemplate,
  forgotPasswordTemplate,
  accountRecoveryTemplate,
};
