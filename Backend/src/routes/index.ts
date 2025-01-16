import express from 'express';
import userRoutes from './userRoute'
import userAuthorization from '../middleware/userMiddleware';
import { getMessages } from './messages';

const router = express.Router();

// Define your routes here
router.use('/users',userRoutes);
router.get('/messages/chat/:smaller/:larger', userAuthorization,getMessages)

export default router;