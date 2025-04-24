import mongoose, { Schema } from 'mongoose';

export interface ITodo {
  _id?: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this task'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema); 