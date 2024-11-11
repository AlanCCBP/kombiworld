const express = require('express');
const router = express.Router();
const userRoleService = require('../services/userRoleService');

// Get all user roles
router.get('/', async (req, res) => {
  try {
    const userRoles = await userRoleService.getAllUserRoles();
    res.status(200).json(userRoles);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user roles' });
  }
});

// Get user role by ID
router.get('/:id', async (req, res) => {
  try {
    const userRole = await userRoleService.getUserRoleById(req.params.id);
    if (userRole) {
      res.status(200).json(userRole);
    } else {
      res.status(404).json({ error: 'User role not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user role' });
  }
});

// Create new user role
router.post('/', async (req, res) => {
  try {
    const newUserRole = await userRoleService.createUserRole(req.body);
    res.status(201).json(newUserRole);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user role' });
  }
});

// Update user role by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedUserRole = await userRoleService.updateUserRole(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedUserRole);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user role' });
  }
});

// Delete user role by ID
router.delete('/:id', async (req, res) => {
  try {
    await userRoleService.deleteUserRole(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user role' });
  }
});

module.exports = router;
