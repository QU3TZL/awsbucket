module.exports = {
  render: {
    host: process.env.RENDER_HOST,
    username: process.env.RENDER_USERNAME, // This will be your SSH username on FlowiseToo
    diskPath: process.env.RENDER_DISKPATH  // This will be /docs/user1/fold1
  }
};
