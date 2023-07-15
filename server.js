const express = require('express');
const fileUpload = require('express-fileupload');
const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const config = require('./config');

const app = express();

app.use(fileUpload());

app.post('/upload/:folder', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let sampleFile = req.files.sampleFile;
  let folder = req.params.folder;

  sampleFile.mv(`/tmp/${sampleFile.name}`, async function(err) {
    if (err)
      return res.status(500).send(err);

    let sftp = new SftpClient();
    try {
      await sftp.connect({
        host: config.render.host,
        username: config.render.username,
        privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH) // Read the private key from the path specified in the environment variable
      });
      await sftp.mkdir(`${config.render.diskPath}/${folder}`, true);
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
