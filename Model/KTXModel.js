import mongoose from 'mongoose'

/* ===== User ===== */
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'student'] },
  phone: String,
  gender: { type: String, enum: ['male', 'female'] }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema, 'user');


/* ===== Student ===== */
const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentCode: { type: String, unique: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  dateOfBirth: { type: Date },
  department: String,
  identityCard: String,
  phone: String,
  address: String,
  avtURL: String
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema, 'students');


/* ===== Room ===== */
const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, unique: true }, // roomNumber = mã phòng
  type: String,
  capacity: Number,
  currentOccupancy: Number,
  status: String,
  pricePerMonth: String,
  note: String
}, { timestamps: true });

export const Room = mongoose.model('Room', roomSchema, 'rooms');


/* ===== Contract ===== */
const contractSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  startDate: Date,
  endDate: Date,
  status: String,
  depositAmount: Number,
  createdAt: Date
});

export const Contract = mongoose.model('Contract', contractSchema, 'contracts');


/* ===== Utility ===== */
const utilitySchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  month: Number,
  year: Number,
  electricityUsage: Number,
  waterUsage: Number,
  electricityCost: Number,
  waterCost: Number,
  totalCost: Number,
  status: String
}, { timestamps: true });

export const Utility = mongoose.model('Utility', utilitySchema, 'utilities');
