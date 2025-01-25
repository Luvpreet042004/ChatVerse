// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../firebase-admin'; // Import the Firebase token verification function

declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
                email: string;
            };
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authorization token missing or malformed' });
        return
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the Firebase ID token
        const decodedToken = await verifyToken(token);
        console.log("in auth");
        

        // Attach the user details to the request object
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
        };

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export default authenticate;
