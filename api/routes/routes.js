const express = require('express');
const router = express.Router();
const routeService = require('../services/routeService');

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await routeService.getAllRoutes();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching routes' });
  }
});

// Get route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await routeService.getRouteById(req.params.id);
    if (route) {
      res.status(200).json(route);
    } else {
      res.status(404).json({ error: 'Route not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching route' });
  }
});

// Create new route
router.post('/', async (req, res) => {
  try {
    const newRoute = await routeService.createRoute(req.body);
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ error: 'Error creating route' });
  }
});

// Update route by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedRoute = await routeService.updateRoute(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedRoute);
  } catch (error) {
    res.status(500).json({ error: 'Error updating route' });
  }
});

// Delete route by ID
router.delete('/:id', async (req, res) => {
  try {
    await routeService.deleteRoute(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting route' });
  }
});

module.exports = router;
