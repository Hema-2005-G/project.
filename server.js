
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// ✅ MongoDB connection string (encoded password for special characters)
const MONGO_URI = 'mongodb+srv://admin:Hema_123@cluster0.g1gqj7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Schema and Model
const recordSchema = new mongoose.Schema({
  date: String,
  work: String,
  hours: String,
  pending: String,
  status: String,
  approval: { type: String, default: "Pending" }
});
const Record = mongoose.model('Record', recordSchema);

// ✅ Serve user.html and admin.html
app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ✅ API Routes

// Get all records
app.get('/api/data', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Add new record ✅ Added console.log here
app.post('/api/data', async (req, res) => {
  try {
    console.log('📥 Data received from user:', req.body);  // <--- this line is new
    const record = new Record(req.body);
    await record.save();
    res.json({ message: 'Data added' });
  } catch (err) {
    console.error('❌ Error saving data:', err);
    res.status(500).json({ error: 'Failed to add record' });
  }
});

// Update approval
app.put('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { approval } = req.body;
    await Record.findByIdAndUpdate(id, { approval });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete a record
app.delete('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Record.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔗 Admin Page: http://localhost:${PORT}/admin`);
  console.log(`🔗 User Page:  http://localhost:${PORT}/user`);
});

