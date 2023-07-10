const express = require('express');
const upload = require('./upload');
const app = express();
const port = process.env.PORT || 3000;

app.post('/upload', upload.array('file', 10), (req, res) => {
  res.send('Files uploaded successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
