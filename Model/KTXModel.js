import mongoose from 'mongoose'
import isEmail from 'validator/lib/isEmail.js'

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
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
    },
})

export const Student = mongoose.model('Student', studentSchema)

const userSchema = new mongoose.Schema({
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
    }
})
export const User = mongoose.model('User', userSchema)

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
    note: {
        type: String,
        default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non.'
    },
    price: {
        type: Number,
        required: true,
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
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
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

