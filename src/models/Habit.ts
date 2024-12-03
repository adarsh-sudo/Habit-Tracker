import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
}

const HabitSchema: Schema<IHabit> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    frequency: { type: String, enum: ['daily', 'weekly'], required: true },
  },
  { timestamps: true }
);

const Habit = mongoose.model<IHabit>('Habit', HabitSchema);
export default Habit;
