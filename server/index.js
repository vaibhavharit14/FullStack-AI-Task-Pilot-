const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true, // Allow any origin properly
  credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('AI Task Management API is running...');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
  });
