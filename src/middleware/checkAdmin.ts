import { Request, Response, NextFunction } from 'express';
import { IUser } from 'src/types';  // Import your IUser interface

// Extend the Express Request interface to include the user object
interface AuthenticatedRequest extends Request {
    user?: IUser;  
}

// Middleware function
const checkAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if the user exists and is an admin
    console.log('admin middleware')
    if (req.user && req.user.isAdmin) {
        next(); // Proceed if the user is an admin
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

export default checkAdmin