const { Prisma, DocType } = require('@prisma/client');
const userService = require('../services/userService');

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await userService.getUsers({ page, limit });

    res.json(result);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = req.body.user;

    if (!user) {
      return res.status(400).json({
        error: 'Invalid request body',
        details: ['El objeto [user] es requerido'],
      });
    }

    const requiredFields = [
      'firstName',
      'lastName',
      'docType',
      'docNumber',
      'email',
      'password',
    ];

    const missingFields = requiredFields.filter(
      (field) => user[field] === undefined || user[field] === null,
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: missingFields,
      });
    }

    const result = await userService.createUser(user);

    if (result.error) {
      return res.status(result.statusCode || 500).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong while creating the user.',
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = req.body.user;

    if (!user || !user.id) {
      return res.status(400).json({ error: 'Missing user or user.id' });
    }

    const updatedUser = await userService.updateUser(user);

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body.user || {};
    if (!id) return res.status(400).json({ error: 'Missing user.id' });

    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser({ email, password });

    if (result.error) {
      return res.status(result.statusCode || 401).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
};
