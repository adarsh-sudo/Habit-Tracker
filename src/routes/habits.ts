import express, { Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import Habit from '../models/Habit';

const router = express.Router();

// Create Habit
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { name, description, frequency } = req.body;

  try {
    const habit = await Habit.create({ userId: req.user?.id, name, description, frequency });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get All Habits
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const habits = await Habit.find({ userId: req.user?.id });
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
