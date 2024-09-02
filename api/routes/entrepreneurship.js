const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all entrepreneurship records
router.get('/', async (req, res) => {
  try {
    const entrepreneurship = await prisma.entrepreneurship.findMany({
      where: {
        deletedAt: null,
      },
    });
    res.json(entrepreneurship);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error retrieving entrepreneurship records' });
  }
});

// Get a specific entrepreneurship by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const entrepreneurship = await prisma.entrepreneurship.findUnique({
      where: { id },
    });
    if (entrepreneurship && !entrepreneurship.deletedAt) {
      res.json(entrepreneurship);
    } else {
      res.status(404).json({ error: 'Entrepreneurship not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the entrepreneurship' });
  }
});

// Create a new entrepreneurship record
router.post('/', async (req, res) => {
  const {
    name,
    description,
    website,
    logoUrl,
    phone,
    address,
    city,
    userId,
    tags,
  } = req.body;
  try {
    const newEntrepreneurship = await prisma.entrepreneurship.create({
      data: {
        name,
        description,
        website,
        logoUrl,
        phone,
        address,
        city,
        userId,
        tags,
      },
    });
    res.status(201).json(newEntrepreneurship);
  } catch (error) {
    res.status(500).json({ error: 'Error creating entrepreneurship' });
  }
});

// Update an entrepreneurship by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    website,
    logoUrl,
    phone,
    address,
    city,
    userId,
    tags,
  } = req.body;
  try {
    const updatedEntrepreneurship = await prisma.entrepreneurship.update({
      where: { id },
      data: {
        name,
        description,
        website,
        logoUrl,
        phone,
        address,
        city,
        userId,
        tags,
        updatedAt: new Date(),
      },
    });
    res.json(updatedEntrepreneurship);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the entrepreneurship' });
  }
});

// Soft delete an entrepreneurship record
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEntrepreneurship = await prisma.entrepreneurship.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    res.json({ message: 'Entrepreneurship successfully soft-deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the entrepreneurship' });
  }
});

module.exports = router;
