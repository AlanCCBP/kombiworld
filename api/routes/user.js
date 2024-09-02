const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user && !user.deletedAt) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the user' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  const { email, password, name, lastName, isAdmin } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        name,
        lastName,
        isAdmin,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating the user' });
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, password, name, lastName, isAdmin } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        password,
        name,
        lastName,
        isAdmin,
        updatedAt: new Date(),
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the user' });
  }
});

// Soft delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    res.json({ message: 'User successfully soft-deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the user' });
  }
});

module.exports = router;
