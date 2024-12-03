import express, { Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import Reminder from '../models/Reminder';
import sendEmail from '../utils/sendEmail';
import Habit from '../models/Habit';
import User from '../models/User';
import { ObjectId, Types } from 'mongoose';

const router = express.Router();


// Send Reminder Emails
router.post('/send-emails', async (req: Request, res: Response) => {
  try {
    let reminderEmails: { email: string | undefined, habitName: string }[] = [];

// Fetch all active reminders at once
const reminders = await Reminder.find({ isActive: true });

// Fetch all habits related to those reminders in one query (we're assuming habits have _id as references in reminders)
const habitIds = [
  ...new Set(reminders.map(reminder => JSON.stringify(reminder.habitId)))
].map(id => JSON.parse(id));

interface Habit {
  _id: ObjectId; // or ObjectId if using MongoDB
  name: string;
  userId: string;
}

const habitIdsObjectIds = habitIds.map(id => Types.ObjectId.createFromHexString(id));

// Fetch habits from the database using the $in operator
const habits: Habit[] = await Habit.find({ _id: { $in: habitIdsObjectIds } });

if(!habits)
  throw new Error;

const userDetails = await Promise.all(
 [ ...new Set( habits.map(async (habit) => {
    const user = await User.findOne({ _id: habit.userId });
    return {
      name: habit.name,
      email: user?.email, // Awaited here to get the actual email value
    };
  }))
]);

const groupedHabitNames = userDetails.reduce((acc, { name , email }) => {
  if (!acc[email!]) {
    acc[email!] = [];
  }
  acc[email!].push(name);
  return acc;
}, {} as Record<string, string[]>);

// Create the final array with concatenated habit names
reminderEmails = Object.entries(groupedHabitNames).map(([email, habitNames]) => ({
  email,
  habitName: habitNames.join(', '), // Concatenate habit names
}));


// Send all emails in one batch
for (const { email, habitName } of reminderEmails) {
  await sendEmail(email, 'Habit Reminder', `It's time to work on: ${habitName}`);
}

    //res.status(200).json({ message: 'Reminders sent' });

    res.status(200).json({ message : "Mail Sent Successfully"})
    console.log(habitIdsObjectIds); // Ensure this contains valid ObjectId strings

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
