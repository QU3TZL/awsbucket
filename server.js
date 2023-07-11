const express = require('express');
const fileUpload = require('express-fileupload');
const SftpClient = require('ssh2-sftp-client');
const config = require('./config');

const app = express();

app.use(fileUpload());

app.post('/upload/:folder', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  let folder = req.params.folder;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`/tmp/${sampleFile.name}`, async function(err) {
    if (err)
      return res.status(500).send(err);

    // After the file is saved locally, transfer it to the Render disk
    let sftp = new SftpClient();
    try {
      await sftp.connect({
        host: config.render.host,
        username: config.render.username,
        password: config.render.password
      });
      await sftp.mkdir(`${config.render.diskPath}/${folder}`, true); // The second parameter set to true makes the function recursive (it will create parent directories if they don't exist)
      await sftp.put(`/tmp/${sampleFile.name}`, `${config.render.diskPath}/${folder}/${sampleFile.name}`);
      res.send('File uploaded and transferred to Render disk!');
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    } finally {
      sftp.end();
    }
  });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
