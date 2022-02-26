module.exports = {
  init(app) {
    app.get('/api/did/user', async (req, res) => {
      res.json({
        user: req.user,
      });
    });
  },
};
