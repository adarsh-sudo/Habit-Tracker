import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  habitId: mongoose.Types.ObjectId;
  reminderTime: string;
  isActive: boolean;
}

const ReminderSchema: Schema<IReminder> = new Schema(
  {
    habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
    reminderTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema);
export default Reminder;
