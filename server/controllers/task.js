const Task = require('../models/Task');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};


const createOrUpdateTask = async (req, res) => {
  try {
    const { id, title, description, status, priority, dueDate, generateAI } = req.body;
    let aiTip = '';

    
    if (generateAI && title) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `As a productivity coach, provide a very brief (max 30 words), motivating tip or a 2-step breakdown for this task: "${title}". Description: "${description || 'None'}". Format as a single paragraph.`;
        const result = await model.generateContent(prompt);
        aiTip = result.response.text();
      } catch (aiError) {
        console.error('Gemini AI Suggestion Error:', aiError.message);
        aiTip = "Break this task down into 2 small steps to get started!";
      }
    }

    if (id) {
      const updateData = { title, description, status, priority, dueDate };
      if (aiTip) updateData.aiTip = aiTip;
      
      const task = await Task.findOneAndUpdate(
        { _id: id, user: req.user.id },
        updateData,
        { new: true }
      );
      if (!task) return res.status(404).json({ message: 'Task not found' });
      return res.status(200).json(task);
    } else {
      const newTask = new Task({
        title,
        description,
        status,
        priority,
        dueDate,
        user: req.user.id,
        aiTip: aiTip || "Focus on one step at a time."
      });
      await newTask.save();
      return res.status(201).json(newTask);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error saving task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

module.exports = { getTasks, createOrUpdateTask, deleteTask };
