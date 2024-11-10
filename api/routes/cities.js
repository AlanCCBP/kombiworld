const express = require('express');
const router = express.Router();
const cityService = require('../services/cityService');

// Get all cities
router.get('/', async (req, res) => {
  try {
    const cities = await cityService.getAllCities();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cities' });
  }
});

// Get city by ID
router.get('/:id', async (req, res) => {
  try {
    const city = await cityService.getCityById(req.params.id);
    if (city) {
      res.status(200).json(city);
    } else {
      res.status(404).json({ error: 'City not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching city' });
  }
});

// Create new city
router.post('/', async (req, res) => {
  try {
    const newCity = await cityService.createCity(req.body);
    res.status(201).json(newCity);
  } catch (error) {
    res.status(500).json({ error: 'Error creating city' });
  }
});

// Update city by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCity = await cityService.updateCity(req.params.id, req.body);
    res.status(200).json(updatedCity);
  } catch (error) {
    res.status(500).json({ error: 'Error updating city' });
  }
});

// Delete city by ID
router.delete('/:id', async (req, res) => {
  try {
    await cityService.deleteCity(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting city' });
  }
});

module.exports = router;
