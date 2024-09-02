const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all social media records
router.get('/', async (req, res) => {
  try {
    const socialMedia = await prisma.socialMedia.findMany();
    res.json(socialMedia);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving social media records' });
  }
});

// Get a specific social media record by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const socialMedia = await prisma.socialMedia.findUnique({
      where: { id },
    });
    if (socialMedia) {
      res.json(socialMedia);
    } else {
      res.status(404).json({ error: 'Social media record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the social media record' });
  }
});

// Create a new social media record
router.post('/', async (req, res) => {
  const { platform, url, entrepreneurshipId } = req.body;
  try {
    const newSocialMedia = await prisma.socialMedia.create({
      data: {
        platform,
        url,
        entrepreneurshipId,
      },
    });
    res.status(201).json(newSocialMedia);
  } catch (error) {
    res.status(500).json({ error: 'Error creating social media record' });
  }
});

// Update a social media record by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { platform, url, entrepreneurshipId } = req.body;
  try {
    const updatedSocialMedia = await prisma.socialMedia.update({
      where: { id },
      data: {
        platform,
        url,
        entrepreneurshipId,
      },
    });
    res.json(updatedSocialMedia);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the social media record' });
  }
});

// Delete a social media record (no soft delete needed here)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.socialMedia.delete({
      where: { id },
    });
    res.json({ message: 'Social media record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the social media record' });
  }
});

module.exports = router;
