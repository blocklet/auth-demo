const { db, asyncDb } = require('../models/posts');

const auth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ code: 'forbidden', error: 'not allowed' });
  }
  return next();
}

module.exports = {
  init(app) {
    app.get('/api/posts/list', async (req, res) => {
      db.cursor({}).sort({ createdAt: -1}).limit(100).exec((err, docs) => {
        res.json(docs);
      })
    });

    app.post('/api/posts/create', auth, async (req, res) => {
      const doc = await asyncDb.insert({
        content: req.body.content,
        poster: {
          did: req.user.did,
          fullName: req.user.fullName,
        },
        comments: []
      })
      res.json(doc);
    });

    app.post('/api/posts/remove', auth, async (req, res) => {
      if (req.user.role !== 'admin') {
        return res.status(401).json({ code: 'forbidden', error: 'not allowed' });
      }

      await asyncDb.remove({
        _id: req.body.id
      })
      res.json({});
    });

    app.post('/api/posts/create_comment', auth, async (req, res) => {
      res.json({
        name: 'create_comment',
        user: req.user,
      });
    });

    app.post('/api/posts/remove_comment', auth, async (req, res) => {
      res.json({
        name: 'remove_comment',
        user: req.user,
      });
    });
  },
};
