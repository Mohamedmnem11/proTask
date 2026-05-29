import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, default: 'user' },
    isActive: { type: Boolean, default: true },   // <-- أضف هذا السطر
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model('User', UserSchema);
export default User;