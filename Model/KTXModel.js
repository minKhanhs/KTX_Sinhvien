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
        default: 'avt404.jpg',
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
        minlenghth: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    refreshTokens: {
        type: [String],
        default: [],
    },
    avtUrl: {
        type: String,
        default: '/avt404.jpg',
    },

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
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Utilities',
    }],
    imageUrl: {
        type: String,
        default: '/room404.jpg',
    },
})
export const Room = mongoose.model('Room', roomSchema)


const utilitySchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
    },
    waterUsage: {
        type: Number,
        default: 0,
    },
    electricityUsage: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    },
})
export const Utility = mongoose.model('Utilities', utilitySchema)
