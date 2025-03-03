import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

export const getMessages = async (req: Request, res: Response) : Promise<void> => {
    const { smaller, larger } = req.params;
    const email = req.user?.email;
    if(!email){
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }

    const sender = await prisma.user.findUnique({where :{email}})
    if(!sender){return}
    const id = sender.id;

    // Validate that the current user is one of the participants
    if (id != Number(smaller) && id != Number(larger)) {
        res.status(403).json({ message: 'Unauthorized access' });
        return;
    }

    try {
        const filteredMsgs = await prisma.directMessage.findMany({
            where: {
                OR: [
                    { senderId: Number(smaller), receiverId: Number(larger) },
                    { senderId: Number(larger), receiverId: Number(smaller) },
                ],
            },
            orderBy: {
                timestamp: 'asc', // Optional: Sort messages by creation time
            },
        });

        res.status(200).json(filteredMsgs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
};