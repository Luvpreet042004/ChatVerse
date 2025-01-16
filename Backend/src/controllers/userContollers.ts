import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { io } from '../server';
const prisma = new PrismaClient();
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            console.log("User already exists");
            
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: newUser.id, email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully',
                token,
                id : newUser.id,
                name: newUser.name,
                email : newUser.email
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req: Request, res: Response):Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where : {email}});
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return ;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return 
        }

        const token = jwt.sign({ id: user.id, email }, JWT_SECRET as string, { expiresIn: '2days' });
        

        res.status(200).json({ message: 'Login successful',
                token,
                id: user.id,
                name: user.name,
                email: user.email
         });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req: Request, res: Response):Promise<void> => {
    const {oldPassword,newPassword} = req.body;
    const email = req.user?.email;

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


        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return 
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword
            },
        });
        const token = jwt.sign({ userId: user.id, email }, JWT_SECRET as string, { expiresIn: '2days' });

        res.status(200).json({ message: 'Password updated successfully',token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteUser = async (req: Request, res: Response):Promise<void> => {
    const email = req.user?.email;
    const password = req.body.password;

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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return 
        }

        await prisma.user.delete({where : {id : user.id}});

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

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
    const id = req.user?.id; // Assuming `req.user` contains the authenticated user's information
    const { connectionEmail } = req.body;

    if (!id) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }

    try {
        // Find the user making the request
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

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
    const id = req.user?.id;

    if (!id) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }

    try {
        
        const user = await prisma.user.findUnique({
            where: { id },
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
    const userId = req.user?.id; // Ensure your middleware sets `req.user`
    const {connectionId} = req.body; // Ensure `connectionId` is sent in the body
  
    try {
      if (!userId || !connectionId) {
        res.status(400).json({ error: "Invalid request. User ID or Connection ID is missing." });
        return;
      }
  
      // Remove the connection for both users
      await prisma.user.update({
        where: { id: userId },
        data: {
          connections: {
            disconnect: { id: connectionId },
          },
        },
      });

      const newConnections = await prisma.user.findUnique({where : {id : userId},select : {connections : {select : {id : true,email :true,name:true}} }})
  
      res.status(200).json({ message: "Connection removed successfully.", newConnections});
    } catch (error) {
      console.error("Error removing connection:", error);
      res.status(500).json({ error: "An error occurred while removing the connection." });
    }
  };