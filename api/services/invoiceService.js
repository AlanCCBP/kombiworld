const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllInvoices() {
  return await prisma.invoice.findMany({
    include: {
      user: true,
      reservation: true,
    },
  });
}

async function getInvoiceById(id) {
  return await prisma.invoice.findUnique({
    where: { id },
    include: {
      user: true,
      reservation: true,
    },
  });
}

async function createInvoice(data) {
  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        userId: data.userId,
        reservationId: data.reservationId,
        amount: data.amount,
        issuedDate: data.issuedDate,
        dueDate: data.dueDate,
        status: data.status,
      },
    });
    return newInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

async function updateInvoice(id, data) {
  return await prisma.invoice.update({
    where: { id },
    data,
  });
}

async function deleteInvoice(id) {
  return await prisma.invoice.delete({
    where: { id },
  });
}

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
