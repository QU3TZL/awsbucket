const express = require('express');
const fileUpload = require('express-fileupload');
const scpClient = require('scp2');
const config = require('./config');

const app = express();

app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let sampleFile = req.files.sampleFile;

  sampleFile.mv('/path/to/local/file', function(err) {
    if (err)
      return res.status(500).send(err);

    scpClient.scp('/path/to/local/file', {
      host: config.render.host,
      username: config.render.username,
      password: config.render.password,
      path: config.render.path + 'myfile'
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
