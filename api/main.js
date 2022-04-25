const { Router } = require('express');
const router = Router();

router.post('/newOrder', async (req, res) => {
  req.app.io.emit('newOrder', { hasOrder: true });
  res.status(204).json({});
});

module.exports = router;