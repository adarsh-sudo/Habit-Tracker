import express, { Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import Reminder from '../models/Reminder';
import sendEmail from '../utils/sendEmail';

const router = express.Router();


// Send Reminder Emails
router.post('/send-emails', async (req: Request, res: Response) => {
  try {
    const reminders = await Reminder.find({ isActive: true });

   // for (const reminder of reminders) {
      // Logic to fetch user's email and habit name
      // For simplicity, dummy email logic is used here
      const email = 'writetoadarshsoni@gmail.com'; // Replace with dynamic logic
      const habitName = 'Exercise'; // Replace with dynamic logic

      await sendEmail(email, 'Habit Reminder', `It's time to work on: ${habitName}`);
   // }

    res.status(200).json({ message: 'Reminders sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create Reminder
router.post('/:habitId', authenticate, async (req: AuthRequest, res: Response) => {
  const { habitId } = req.params;
  const { reminderTime } = req.body;

  try {
    const reminder = await Reminder.create({ habitId, reminderTime, isActive: true });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



export default router;
