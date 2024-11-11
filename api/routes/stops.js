const express = require('express');
const router = express.Router();
const stopService = require('../services/stopService');

// Get all stops
router.get('/', async (req, res) => {
  try {
    const stops = await stopService.getAllStops();
    res.status(200).json(stops);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stops' });
  }
});

// Get stop by ID
router.get('/:id', async (req, res) => {
  try {
    const stop = await stopService.getStopById(req.params.id);
    if (stop) {
      res.status(200).json(stop);
    } else {
      res.status(404).json({ error: 'Stop not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stop' });
  }
});

// Create new stop
router.post('/', async (req, res) => {
  try {
    const newStop = await stopService.createStop(req.body);
    res.status(201).json(newStop);
  } catch (error) {
    res.status(500).json({ error: 'Error creating stop' });
  }
});

// Update stop by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedStop = await stopService.updateStop(req.params.id, req.body);
    res.status(200).json(updatedStop);
  } catch (error) {
    res.status(500).json({ error: 'Error updating stop' });
  }
});

// Delete stop by ID
router.delete('/:id', async (req, res) => {
  try {
    await stopService.deleteStop(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting stop' });
  }
});

module.exports = router;
