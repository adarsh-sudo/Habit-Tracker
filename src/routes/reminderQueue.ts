import Queue from 'bull';
import sendEmail from '../utils/sendEmail';
import Reminder from '../models/Reminder';

const reminderQueue = new Queue('reminders', {
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
    settings: {
      skipVersionCheck: true, // Skip version checks
    }
  });
  

// Process jobs
reminderQueue.process(async (job) => {
  const { email, habitName } = job.data;

  // Send the reminder email
  await sendEmail(email, 'Habit Reminder', `It's time to work on: ${habitName}`);
  console.log(`Email sent to ${email} for habit: ${habitName}`);
});

export default reminderQueue;
