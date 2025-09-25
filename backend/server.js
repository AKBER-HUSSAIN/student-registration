require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());               // Allow cross-origin requests (for dev & deploy; restrict in prod)
app.use(express.json());       // Parse JSON bodies

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentsdb';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Student schema and model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  department: { type: String, enum: ['IT', 'CSE', 'AIDS', 'CET'], required: true },
  section: { type: String, enum: ['1', '2', '3'], required: true },
  skills: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});
const Student = mongoose.model('Student', studentSchema);

// Routes
app.post('/students', async (req, res) => {
  try {
    const { name, rollNo, gender, department, section, skills } = req.body;
    // Basic validation
    if (!name || !rollNo || !gender || !department || !section) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const student = new Student({ name, rollNo, gender, department, section, skills });
    await student.save();
    res.json({ message: 'Student saved', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Save failed' });
  }
});

app.get('/students', async (req, res) => {
  try {
    const list = await Student.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Health
app.get('/', (req, res) => res.send('Student Registration API is running'));

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
