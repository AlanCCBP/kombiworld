const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const prisma = new PrismaClient();

// Register new user
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await prismaClient.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ message: 'Login successful', token });
});

// Password recovery
router.post('/recover-password', async (req, res) => {
  const { email } = req.body;

  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const recoveryToken = crypto.randomBytes(32).toString('hex');
  const recoveryTokenHash = await bcrypt.hash(recoveryToken, 10);

  await prismaClient.passwordRecovery.create({
    data: {
      userId: user.id,
      token: recoveryTokenHash,
    },
  });

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

  res.status(200).json({ message: 'Recovery email sent' });
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  const recoveryRecord = await prismaClient.passwordRecovery.findUnique({
    where: { token },
  });
  if (!recoveryRecord) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prismaClient.user.update({
    where: { id: recoveryRecord.userId },
    data: { password: hashedPassword },
  });

  await prismaClient.passwordRecovery.delete({ where: { token } });

  res.status(200).json({ message: 'Password successfully reset' });
});

// Refresh token
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    res.status(200).json({ token: newToken });
  });
});

module.exports = router;
