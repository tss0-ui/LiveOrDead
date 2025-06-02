// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('./stripe');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/verify-card', async (req, res) => {
  const { payment_method_id, applicant_name } = req.body;

  try {
    const result = await stripe.verifyCard(payment_method_id);

    // Save audit
    db.insertLog(applicant_name, payment_method_id, result.status);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ status: 'DEAD', error: error.message });
  }
});

app.get('/api/audit-log', (req, res) => {
  const logs = db.getAllLogs();
  res.json(logs);
});

app.listen(3001, () => {
  console.log('Fraud Risk backend running on port 3001');
});
