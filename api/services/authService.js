const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION_TIME = '1h';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your_refresh_secret';
const JWT_REFRESH_EXPIRATION_TIME = '7d';

// Function to hash passwords
const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

// Function to compare passwords
const comparePasswords = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Register new user
async function registerUser(data) {
  const { email, password, name, lastName } = data;
  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      lastName,
    },
  });
  return newUser;
}

// Login user
async function loginUser(data) {
  const { email, password } = data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePasswords(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_TIME,
  });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION_TIME,
  });

  return { accessToken, refreshToken };
}

// Send password recovery email
async function sendPasswordRecoveryEmail(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const recoveryToken = crypto.randomBytes(32).toString('hex');
  const recoveryTokenHash = await hashPassword(recoveryToken);
  await prisma.passwordRecovery.create({
    data: {
      userId: user.id,
      token: recoveryTokenHash,
    },
  });

  // Send email (example with nodemailer)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const recoveryLink = `${process.env.APP_URL}/reset-password?token=${recoveryToken}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Recovery',
    text: `Click here to reset your password: ${recoveryLink}`,
  });

  return { message: 'Recovery email sent' };
}

// Reset password using token
async function resetPassword(token, newPassword) {
  const recovery = await prisma.passwordRecovery.findUnique({
    where: { token },
  });
  if (!recovery) {
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: recovery.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordRecovery.delete({ where: { token } });

  return { message: 'Password reset successful' };
}

// Refresh token
async function refreshToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const newAccessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION_TIME,
    });
    const newRefreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRATION_TIME,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

module.exports = {
  registerUser,
  loginUser,
  sendPasswordRecoveryEmail,
  resetPassword,
  refreshToken,
};
