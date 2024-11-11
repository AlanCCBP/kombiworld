const express = require('express');
const router = express.Router();
const scheduleService = require('../services/scheduleService');

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await scheduleService.getAllSchedules();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching schedules' });
  }
});

// Get schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.id);
    if (schedule) {
      res.status(200).json(schedule);
    } else {
      res.status(404).json({ error: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching schedule' });
  }
});

// Create new schedule
router.post('/', async (req, res) => {
  try {
    const newSchedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: 'Error creating schedule' });
  }
});

// Update schedule by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedSchedule = await scheduleService.updateSchedule(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ error: 'Error updating schedule' });
  }
});

// Delete schedule by ID
router.delete('/:id', async (req, res) => {
  try {
    await scheduleService.deleteSchedule(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting schedule' });
  }
});

module.exports = router;
