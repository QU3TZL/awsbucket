const express = require('express');
const fileUpload = require('express-fileupload');
const scpClient = require('scp2');

const app = express();

app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/path/to/local/file', function(err) {
    if (err)
      return res.status(500).send(err);

    // After the file is saved locally, transfer it to the Render disk
    scpClient.scp('/path/to/local/file', {
      host: 'ssh.YOUR_REGION.render.com',
      username: 'YOUR_SERVICE',
      password: 'YOUR_PASSWORD',
      path: '/destination/path/for/remote/file'
    }, function(err) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      res.send('File uploaded and transferred to Render disk!');
    });
  });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
