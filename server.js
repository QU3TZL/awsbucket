const express = require('express');
const fileUpload = require('express-fileupload');
const scpClient = require('scp2');
const config = require('./config');

const app = express();

app.use(fileUpload());

app.post('/upload/:folder', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  let folder = req.params.folder;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`/tmp/${sampleFile.name}`, function(err) {
    if (err)
      return res.status(500).send(err);

    // After the file is saved locally, transfer it to the Render disk
    scpClient.scp(`/tmp/${sampleFile.name}`, {
      host: config.render.host,
      username: config.render.username,
      password: config.render.password,
      path: `${config.render.diskPath}/${folder}/${sampleFile.name}`
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
