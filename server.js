const express = require('express');
const cors = require('cors');
const upload = require('./upload');
const app = express();
const port = process.env.PORT || 3000;

// Add this line to use the CORS middleware
app.use(cors({
  origin: 'https://tenfold.onrender.com'
}));

app.post('/upload', upload.array('file', 10), (req, res) => {
  res.send('Files uploaded successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
