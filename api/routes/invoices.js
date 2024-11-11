const express = require('express');
const router = express.Router();
const invoiceService = require('../services/invoiceService');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoices' });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (invoice) {
      res.status(200).json(invoice);
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoice' });
  }
});

// Create new invoice
router.post('/', async (req, res) => {
  try {
    const newInvoice = await invoiceService.createInvoice(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Error creating invoice' });
  }
});

// Update invoice by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedInvoice = await invoiceService.updateInvoice(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Error updating invoice' });
  }
});

// Delete invoice by ID
router.delete('/:id', async (req, res) => {
  try {
    await invoiceService.deleteInvoice(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting invoice' });
  }
});

module.exports = router;
