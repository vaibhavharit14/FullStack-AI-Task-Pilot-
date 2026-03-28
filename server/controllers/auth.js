const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    
    
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ user: { id: user._id, name, email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    // DEMO USER LOGIC
    if (email === 'demo@example.com') {
      if (!user) {
        const hashedPassword = await bcrypt.hash('demo123', 12);
        user = new User({ name: 'Demo Recruiter', email: 'demo@example.com', password: hashedPassword });
        await user.save();
      }

      const taskCount = await Task.countDocuments({ user: user._id });
      if (taskCount === 0) {
        const demoTasks = [
          { title: 'Project Research', description: 'Deep dive into current market trends and competitor analysis.', priority: 'high', status: 'completed', user: user._id, aiTip: 'Analyze the top 3 competitors to identify a unique value proposition!' },
          { title: 'UI Design Refinement', description: 'Polishing the dashboard components to meet high-end aesthetics.', priority: 'medium', status: 'pending', user: user._id, aiTip: 'Use a consistent 8px grid to ensure perfect component spacing.' },
          { title: 'Backend API Deployment', description: 'Configuring Render and environment variables for the live environment.', priority: 'high', status: 'pending', user: user._id, aiTip: 'Double-check that all environment variables are correctly mapped on Render.' },
          { title: 'Write Documentation', description: 'Comprehensive README and API documentation for final submission.', priority: 'medium', status: 'completed', user: user._id, aiTip: 'Use visual diagrams (Mermaid) to explain the project architecture clearly.' },
          { title: 'Test AI Integration', description: 'Confirm that Gemini API is generating meaningful tips for all task types.', priority: 'low', status: 'pending', user: user._id, aiTip: 'Try creating tasks with vague descriptions to see how robust the AI is.' },
          { title: 'Final Code Review', description: 'Refactoring and removing redundant logs from the entire codebase.', priority: 'medium', status: 'pending', user: user._id, aiTip: 'Consistent variable naming across both frontend and backend is key.' },
          { title: 'Deployment Success', description: 'Celebrate the successful deployment of the Full Stack Portfolio!', priority: 'high', status: 'completed', user: user._id, aiTip: 'Take a high-quality demo video for your LinkedIn profile!' }
        ];
        await Task.insertMany(demoTasks);
      }
    } else {
      if (!user) return res.status(404).json({ message: 'User not found' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { register, login };
