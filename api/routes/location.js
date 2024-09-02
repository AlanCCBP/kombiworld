const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all location records
router.get('/', async (req, res) => {
  try {
    const locations = await prisma.location.findMany();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving location records' });
  }
});

// Get a specific location by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const location = await prisma.location.findUnique({
      where: { id },
    });
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving the location' });
  }
});

// Create a new location record
router.post('/', async (req, res) => {
  const { latitude, longitude, entrepreneurshipId } = req.body;
  try {
    const newLocation = await prisma.location.create({
      data: {
        latitude,
        longitude,
        entrepreneurshipId,
      },
    });
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ error: 'Error creating location record' });
  }
});

// Update a location record by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, entrepreneurshipId } = req.body;
  try {
    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        latitude,
        longitude,
        entrepreneurshipId,
      },
    });
    res.json(updatedLocation);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the location' });
  }
});

// Delete a location record (no soft delete needed here)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.location.delete({
      where: { id },
    });
    res.json({ message: 'Location record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the location record' });
  }
});

module.exports = router;
