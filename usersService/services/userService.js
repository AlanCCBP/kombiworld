const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const userUtils = require('../utils/userUtils');
const { PrismaClient } = require('@prisma/client');
const csv = require('csv-parser');
const stream = require('stream');
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

exports.updateUser = async (userId, updates) => {
  try {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await userModel.updateUser({
      id: userId,
      ...updates,
    });

    return updatedUser;
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

exports.getUsers = async (filterOptions) => {
  return await userModel.getUsers(filterOptions);
};

exports.getUser = async (id) => {
  console.log('ALOSADASODAS', id);
  return await userModel.findUserById(id);
};

exports.importContactsFromCSV = async (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    bufferStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const passwordHash = await bcrypt.hash('temporary123', 10);
          const createdUsers = [];

          for (const row of results) {
            const firstName = row['First Name'] || 'NoName';
            const lastName = row['Last Name'] || 'NoLastName';
            const email =
              row['E-mail 1 - Value'] ||
              `${firstName.toLowerCase()}.${lastName.toLowerCase()}@temp.com`;
            const phone = row['Phone 1 - Value'] || null;
            const birthdate = row['Birthday']
              ? new Date(row['Birthday'])
              : null;

            try {
              const newUser = await userModel.createUser({
                firstName,
                lastName,
                email,
                phone,
                docNumber: 'pending',
                docType: 'DNI',
                password: passwordHash,
                status: 'USER',
                birthdate,
              });
              createdUsers.push(newUser);
            } catch (err) {
              console.error(
                'Error creating user:',
                firstName,
                lastName,
                err.message,
              );
            }
          }
          resolve(createdUsers);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => reject(err));
  });
};
