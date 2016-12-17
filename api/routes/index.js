import express from 'express';
import { resolve } from 'path';

import authRouter from './auth';
import messageRouter from './messages';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Server working!');
});

router.use('/auth', authRouter);

router.use('/messages', messageRouter);

export default router;
