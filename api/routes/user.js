const env = require('../libs/env');

module.exports = {
  init(app) {
    app.get('/api/did/user', async (req, res) => {
      res.json({
        user: req.user,
      });
    });

    app.get('/api/env', (req, res) => {
      res.type('js');
      res.send(`window.env = ${JSON.stringify(env, null, 2)}`);
    });
  },
};
