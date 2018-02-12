import { Router } from 'express';
import { router as usersRouter } from './user_controller';

const router = Router();
router.use('/users', usersRouter);

exports.router = router;