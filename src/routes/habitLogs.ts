import express, { Request, Response } from 'express';
import { authenticate , AuthRequest } from '../middleware/auth';
import HabitLog from '../models/HabitLog';

const router = express.Router();

// Log Habit Completion
router.post('/:habitId', authenticate, async (req: AuthRequest, res: Response) => {
  const { habitId } = req.params;
  const { date, status } = req.body;

  try {
    const habitLog = await HabitLog.create({ habitId, date, status });
    res.status(201).json(habitLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Logs for a Habit
router.get('/:habitId', authenticate, async (req: AuthRequest, res: Response) => {
  const { habitId } = req.params;

  try {
    const logs = await HabitLog.find({ habitId });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
