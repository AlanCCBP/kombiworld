const express = require('express');
const router = express.Router();
const carService = require('../services/carService');

// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await carService.getAllCars();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars' });
  }
});

// Get car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (car) {
      res.status(200).json(car);
    } else {
      res.status(404).json({ error: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching car' });
  }
});

// Create new car
router.post('/', async (req, res) => {
  try {
    const newCar = await carService.createCar(req.body);
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: 'Error creating car' });
  }
});

// Update car by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCar = await carService.updateCar(req.params.id, req.body);
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: 'Error updating car' });
  }
});

// Delete car by ID
router.delete('/:id', async (req, res) => {
  try {
    await carService.deleteCar(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting car' });
  }
});

module.exports = router;
