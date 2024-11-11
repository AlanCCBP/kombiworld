const express = require('express');
const router = express.Router();
const reservationService = require('../services/reservationService');

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});

// Get reservation by ID
router.get('/:id', async (req, res) => {
  try {
    const reservation = await reservationService.getReservationById(
      req.params.id,
    );
    if (reservation) {
      res.status(200).json(reservation);
    } else {
      res.status(404).json({ error: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reservation' });
  }
});

// Create new reservation
router.post('/', async (req, res) => {
  try {
    const newReservation = await reservationService.createReservation(req.body);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: 'Error creating reservation' });
  }
});

// Update reservation by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedReservation = await reservationService.updateReservation(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: 'Error updating reservation' });
  }
});

// Delete reservation by ID
router.delete('/:id', async (req, res) => {
  try {
    await reservationService.deleteReservation(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting reservation' });
  }
});

module.exports = router;
