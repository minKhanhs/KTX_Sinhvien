import { Student,Room } from "../Model/KTXModel.js";

const roomController = {
    addRoom: async (req, res) => {
        try{
            const newRoom = new Room(req.body);
            const savedRoom = await newRoom.save();
            res.status(200).json(savedRoom);
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    },
    getAllRoom: async (req, res) => {
        try{
            const rooms = await Room.find();
            res.status(200).json(rooms);
        }catch(err){
            res.status(500).json(err);
        }
    },
    getARoom: async (req, res) => {
        try{
            const room = await Room.findById(req.params.id).populate('students');
            if(!room) return res.status(404).json({message: 'Room not found'});
            res.status(200).json(room);
        }catch(err){
            res.status(500).json(err);
        }
    },
    updateRoom: async (req, res) => {
        try{
            const room = await Room.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
            if(!room) return res.status(404).json({message: 'Room not found'});
            res.status(200).json("Room updated successfully");
        }catch(err){
            res.status(500).json(err);
        }
    },
    deleteRoom: async (req, res) => {
        try{
            await Student.updateMany({room: req.params.id}, {room: null});
            const room = await Room.findByIdAndDelete(req.params.id);
            if(!room) return res.status(404).json({message: 'Room not found'});
            res.status(200).json("Room deleted successfully");
        }catch(err){
            res.status(500).json(err);
        }
    },
    addUtilities: async (req, res) => {
        try{
            const room = await Room.findById(req.params.id);
            if(!room) return res.status(404).json({message: 'Room not found'});
            room.utilities.unshift({
                waterUsage: req.body.waterUsage || 0,
                electricityUsage: req.body.electricityUsage || 0,
                month: req.body.month,
                year: req.body.year,
                status: req.body.status || 'unpaid'
            });
            if(room.utilities.length > 3) {
                room.utilities.pop();
            }
            await room.save();
            res.status(200).json(room);
        }catch(err){
            res.status(500).json(err);
        }
    },
    updateUtilities: async (req, res) => {
        try {
            const room = await Room.findById(req.params.id);
            if (!room) return res.status(404).json({ message: "Room not found" });
    
            if (room.utilities.length === 0) {
                return res.status(400).json({ message: "No utilities to update" });
            }
            room.utilities[0] = {
                ...room.utilities[0]._doc,
                ...req.body,
            };
    
            await room.save();
    
            res.status(200).json({ message: "Utility updated successfully", utilities: room.utilities });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
};
export default roomController;