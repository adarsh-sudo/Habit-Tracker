import mongoose, { Schema, Document } from 'mongoose';

export interface IHabitLog extends Document {
  habitId: mongoose.Types.ObjectId;
  date: Date;
  status: boolean;
}

const HabitLogSchema: Schema<IHabitLog> = new Schema(
  {
    habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
    date: { type: Date, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const HabitLog = mongoose.model<IHabitLog>('HabitLog', HabitLogSchema);
export default HabitLog;
