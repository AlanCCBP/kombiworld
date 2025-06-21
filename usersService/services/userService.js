const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const userUtils = require('../utils/userUtils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUser = async (userData) => {
  try {
    const { roleIds = [], password, ...userFields } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await userModel.createUser({
      ...userFields,
      password: hashedPassword,
    });

    if (roleIds.length > 0) {
      const userRoleInserts = roleIds.map((roleId) => ({
        roleId: roleId,
        userId: createdUser.id,
      }));

      await prisma.userRole.createMany({
        data: userRoleInserts,
        skipDuplicates: true,
      });
    }

    const userWithRoles = await userModel.findUserById(createdUser.id);

    const userRoles = userWithRoles.userRoles.map((ur) => ur.role);

    return {
      ...createdUser,
      userRoles,
    };
  } catch (error) {
    console.error('Error in userService.createUser:', error);
    return {
      error: 'Failed to create user',
      statusCode: 500,
      details: error.message,
    };
  }
};

exports.updateUser = async (userData) => {
  try {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = await userModel.updateUser(userData);
    return user;
  } catch (error) {
    console.error('UpdateUser error:', error);
    return { error: 'User update failed', message: error.message };
  }
};

exports.deleteUser = async (userId) => {
  try {
    const user = await userModel.deleteUser(userId);
    return { message: 'User logically deleted', user };
  } catch (error) {
    console.error('DeleteUser error:', error);
    return { error: 'User deletion failed', message: error.message };
  }
};

exports.loginUser = async ({ email, password }) => {
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return {
        error: 'Unauthorized',
        message: 'Invalid email or password',
        statusCode: 401,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        error: 'Unauthorized',
        message: 'Invalid email or password',
        statusCode: 401,
      };
    }

    const token = jwt.sign(
      {
        userId: user.id,
        userRoles: user.userRoles.map((r) => r.name),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    );

    return {
      user: userUtils.sanitizeUser(user),
      token,
    };
  } catch (error) {
    console.error('loginUser error:', error);
    return {
      error: 'Internal Server Error',
      message: 'Login failed',
      statusCode: 500,
    };
  }
};

exports.getUsers = async (pagination) => {
  return await userModel.getAllUsers(pagination);
};

exports.getUser = async (id) => {
  return await userModel.findUserById(id);
};
