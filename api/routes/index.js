import express from 'express';
import { resolve } from 'path';

import authRouter from './auth';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Server working!');
});

router.use('/auth', authRouter);


// wildcard route middleware -> returns index.html for react-router to work properly
// must be last middleware -> after all routes
router.use('/*', (req, res) => {
  res.sendFile(resolve(__dirname, '../../public/index.html'));
});

export default router;
