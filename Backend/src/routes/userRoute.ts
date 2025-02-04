import express from 'express';
import { registerUser, loginUser,deleteUser, addConnection, getUser, checkUser,connections, getFriend,RemoveConnection} from '../controllers/userContollers';
import userAuthorization from '../middleware/userMiddleware';

const router = express.Router();

router.get('/login',userAuthorization,loginUser);
router.post('/register', registerUser);
router.delete('/delete/:userId', userAuthorization,deleteUser);
router.post('/connect',userAuthorization,addConnection);
router.get('/get',userAuthorization,getUser) ;
router.get('/connections',userAuthorization,connections) ;
router.post('/check',userAuthorization,checkUser) ;
router.get('/getfriend/:id',userAuthorization,getFriend);
router.delete('/deleteConnections',userAuthorization,RemoveConnection);

export default router;