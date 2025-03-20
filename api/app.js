const express = require('express');
const bodyParser = require('body-parser');
const generateContentRouter = require('./generateContent');
const cors=require('cors')
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
};

app.use(cors());
app.use(bodyParser.json());
app.get('/',(req,res) =>{

  res.json({hello:"hello"})
}
)

app.use('/api', generateContentRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
              
const PORT =  3005;
const http = require('http');
const server = http.createServer(app);
server.timeout = 0; 
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
