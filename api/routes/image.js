const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all image records
router.get('/', async (req, res) => {
  try {
    const images = await prisma.image.findMany();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving image records' });
  }
});

// Get a specific image by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const image = await prisma.image.findUnique({
      where: { id },
    });
    if (image) {
      res.json(image);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the image' });
  }
});

// Create a new image record
router.post('/', async (req, res) => {
  const { url, entrepreneurshipId } = req.body;
  try {
    const newImage = await prisma.image.create({
      data: {
        url,
        entrepreneurshipId,
      },
    });
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: 'Error creating image record' });
  }
});

// Update an image record by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { url, entrepreneurshipId } = req.body;
  try {
    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        url,
        entrepreneurshipId,
      },
    });
    res.json(updatedImage);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the image' });
  }
});

// Delete an image record (no soft delete needed here)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.image.delete({
      where: { id },
    });
    res.json({ message: 'Image record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the image record' });
  }
});

module.exports = router;
