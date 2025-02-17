const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const Blog = require('./schema'); // Import schema

const app = express();
const port = 3010;

// Middleware
app.use(express.static('static'));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/blogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Route: Serve Homepage
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Route: Create a New Blog Post
app.post('/api/blogs', async (req, res) => {
  try {
    const newPost = new Blog(req.body);
    await newPost.save();
    res.status(201).json({ message: 'Blog post created', post: newPost });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route: Get All Blog Posts
app.get('/api/blogs', async (req, res) => {
  try {
    const posts = await Blog.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(Example app listening at http://localhost:${port});
});
