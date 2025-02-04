import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { io } from '../server';
const prisma = new PrismaClient();
import { getAuth } from "firebase-admin/auth";
import { number } from 'zod';
dotenv.config()

// Register User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email } = req.body;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            console.log("User already exists");
            return;
        }

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
            },
        });

        res.status(201).json({
            message: 'User registered successfully',
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const email = req.user?.email;

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        res.status(200).json({
            message: 'Login successful',
            id: user.id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const deleteUser = async (req: Request, res: Response):Promise<void> => {
    const id = req.params.userId;
    const email = req.user?.email;
    const firebaseUid = req.user?.uid; 
    if (!firebaseUid) {
        throw new Error("Firebase UID is missing.");
    }

    try {

        const user = await prisma.user.findUnique({where : {email}})
        const userId = user?.id;
        if(!userId && firebaseUid && (userId == Number(id))) {return}

            // Step 2: Delete the user from the database
            await prisma.user.delete({ where: { id: userId } });

        // Step 3: Delete user from Firebase
        await getAuth().deleteUser(firebaseUid);

        // Respond with success
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error:any) {
        console.error("Error during user deletion:", error);

        if (error.code === "auth/user-not-found") {
            res.status(404).json({ message: "User not found in Firebase." });return 
        }

        res.status(500).json({ message: "Failed to delete user. Please try again." });
    }
};

export const getUser = async (req: Request, res: Response):Promise<void> => {
    const email = req.body.email;

    if(!email){
        res.status(400).json({ message: 'Invalid credentials' });
            return ;
    }

    try {
        const user = await prisma.user.findUnique({where :{email}});
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return ;
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const addConnection = async (req: Request, res: Response): Promise<void> => {
    const email = req.user?.email; // Assuming `req.user` contains the authenticated user's information
    const { connectionEmail } = req.body;

    if (!email) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }

    try {
        // Find the user making the request
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const id = user.id;

        // Find the user to be connected
        const connectionUser = await prisma.user.findUnique({
            where: { email: connectionEmail },
        });

        if (!connectionUser) {
            res.status(404).json({ message: 'Connection user not found' });
            return;
        }

        // Add the connection by updating the `connections` relation
        await prisma.user.update({
            where: { id: connectionUser.id },
            data: {
                connections: {
                    connect: { id: id },
                },
            },
        });

        await prisma.user.update({
            where: { id: id },
            data: {
                connections: {
                    connect: { email: connectionEmail },
                },
            },
        });

        io.to(id.toString()).emit('updateConnection',id);
        io.to(connectionUser.id.toString()).emit('updateConnection',connectionUser.id)

        res.status(200).json({ message: 'Connection added successfully' });
    } catch (error) {
        console.error('Error adding connection:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const connections = async (req: Request, res: Response): Promise<void> => {
    const email = req.user?.email;

    if (!email) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }

    try {
        
        const user = await prisma.user.findUnique({
            where: { email },
            include: { connections: true },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ connections: user.connections });

    } catch (error) {
        console.error('Error fetching connections:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const checkUser = async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ exists: false });
            return;
        }

        res.status(200).json({ exists: true });
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getFriend = async (req: Request, res: Response):Promise<void> => {
    const id = req.params.id;

    if(!id){
        res.status(400).json({ message: 'Invalid credentials' });
            return ;
    }

    try {
        const user = await prisma.user.findUnique({where :{id : Number(id)}});
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return ;
        }

        res.status(200).json({ id: user.id, name : user.name, email : user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const RemoveConnection = async (req: Request, res: Response): Promise<void> => {
    const email = req.user?.email; // Ensure your middleware sets `req.user`
    const {connectionId} = req.body; // Ensure `connectionId` is sent in the body
  
    try {
      if (!email || !connectionId) {
        res.status(400).json({ error: "Invalid request. User ID or Connection ID is missing." });
        return;
      }
  
      // Remove the connection for both users
      await prisma.user.update({
        where: { email },
        data: {
          connections: {
            disconnect: { id: connectionId },
          },
        },
      });

      const newConnections = await prisma.user.findUnique({where : {email},select : {connections : {select : {id : true,email :true,name:true}} }})
  
      res.status(200).json({ message: "Connection removed successfully.", newConnections});
    } catch (error) {
      console.error("Error removing connection:", error);
      res.status(500).json({ error: "An error occurred while removing the connection." });
    }
  };