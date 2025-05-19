import { Student, Room, Utility } from "../Model/KTXModel.js";

const roomController = {
    addRoom: async (req, res) => {
        try {
            const data = { ...req.body };
            if (data.note === "") delete data.note;
            const existingRoom = await Room.findOne({ roomNumber: data.roomNumber });
            if (existingRoom) {
                return res.status(400).json({ message: "Phòng đã tồn tại!" });
            }
            const newRoom = new Room(data);
            const savedRoom = await newRoom.save();
            res.status(200).json(savedRoom);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    getAllRoom: async (req, res) => {
        try {
            const rooms = await Room.find();
            res.status(200).json(rooms);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getARoom: async (req, res) => {
        try {
            const room = await Room.findById(req.params.id).populate('students').populate('utilities');
            if (!room) return res.status(404).json({ message: 'Room not found' });
            res.status(200).json(room);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateRoom: async (req, res) => {
        try {
            const updateData = { ...req.body };
            if (updateData.note === "") delete updateData.note;

            const room = await Room.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
            if (!room) return res.status(404).json({ message: 'Room not found' });

            res.status(200).json(room);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    deleteRoom: async (req, res) => {
        try {
            const roomId = req.params.id;
            await Student.updateMany({ room: roomId }, { room: null });
            await Utility.deleteMany({ room: roomId });
            const room = await Room.findByIdAndDelete(roomId);
            if (!room) return res.status(404).json({ message: 'Room not found' });
            res.status(200).json("Room deleted successfully");
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

export default roomController;
