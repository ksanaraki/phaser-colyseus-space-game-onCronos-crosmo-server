import express from 'express'

const router = express.Router()
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/score');

router.get('/health-check', (req, res) =>
  res.send('OK')
)

router.use('/auth', authRoutes);
router.use('/score', scoreRoutes);

module.exports = router;