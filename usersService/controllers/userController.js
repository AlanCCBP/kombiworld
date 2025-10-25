const userService = require('../services/userService');

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filterOptions } = req.query;

    const result = await userService.getUsers({
      filterOptions,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json(result);
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUser(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = req.body; // 👈 directo, no req.body.user

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
    const { userId } = req.params;
    const updates = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter' });
    }

    const updatedUser = await userService.updateUser(userId, updates);

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const result = await userService.deleteUser(userId);
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

exports.importContacts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file not provided' });
    }

    const result = await userService.importContactsFromCSV(req.file.buffer);

    res.json({
      message: `Users imported: ${result.length}`,
      users: result,
    });
  } catch (error) {
    console.error('importContacts error:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
};
