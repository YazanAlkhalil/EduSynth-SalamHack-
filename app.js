const express = require('express');
const bodyParser = require('body-parser');
const generateContentRouter = require('./generateContent');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', generateContentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
console.log("hi2");
              
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("test");
  
  console.log(`Server running on port ${PORT}`);
});
