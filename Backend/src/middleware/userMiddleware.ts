// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../firebase-admin';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                name: string;
            };
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = await verifyToken(token);
        (req as any).user = decodedToken;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const userAuthorization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authorization token missing or malformed' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };

        const thisUser = await prisma.user.findUnique({
            where: {
                id: decoded.id,
                email: decoded.email,
            },
        });

        if (!thisUser) {
            res.status(401).json({ error: 'Invalid token or user not found' });
            return;
        }

        req.user = {
            id: thisUser.id,
            email: thisUser.email,
            name: thisUser.name,
        };

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(400).json({ error: 'Invalid token.' });
    }
};

export default userAuthorization;
