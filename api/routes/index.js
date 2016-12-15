import express from 'express';
import { resolve } from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Server working!');
});

// wildcard route middleware -> returns index.html for react-router to work properly
router.use('/*', (req, res) => {
  res.sendFile(resolve(__dirname, '../../public/index.html'));
});

export default router;
