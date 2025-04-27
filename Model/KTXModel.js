import mongoose from 'mongoose'
import isEmail from 'validator/lib/isEmail'

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
    },
    phone: {
        type: String,
    },
    avtUrl: {
        type: String,
        default: '../src/assets/avt404.jpg',
    },
    studentCode: {
        type: Number,
        required: true,
        unique: true,
    },
    department: {
        type: String,
    },
    roomNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
    },
})

export const Student = mongoose.model('Student', studentSchema)

const usserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'Invalid email address'],
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'user',
    },
})
export const User = mongoose.model('User', usserSchema)

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
    },
    maxStudents: {
        type: Number,
        required: true,
        default: 5,
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        },
    ],
    utilities: [{
        waterUsage: {
            type: Number,
            default: 0,
        },
        electricityUsage: {
            type: Number,
            default: 0,
        },
        waterCost: {
            type: Number,
            default: 0,
        },
        electricityCost: {
            type: Number,
            default: 0,
        },
        month: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['paid', 'unpaid'],
            default: 'unpaid',
        },
    }],
})
export const Room = mongoose.model('Room', roomSchema)

const contractSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
})
export const Contract = mongoose.model('Contract', contractSchema)

