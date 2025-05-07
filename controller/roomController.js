import { Student,Room } from "../Model/KTXModel.js";
import cloudinary from "../untils/cloudinary.js";

const handleImageUpload = async (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'ktx/rooms',
                resource_type: 'image',
                format: 'jpg',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(file.buffer);
    });
};

const roomController = {
    addRoom: async (req, res) => {
        try {
            let imageUrl = "";
            if (req.file) {
                imageUrl = await handleImageUpload(req.file);
            }
    
            const data = {
                ...req.body,
                ...(imageUrl && { imageUrl }),
            };
            if (data.note === "") delete data.note;
            if (data.imageUrl === "") delete data.imageUrl;
    
            const newRoom = new Room(data);
            const savedRoom = await newRoom.save();
            res.status(200).json(savedRoom);
        } catch (err) {
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
            const room = await Room.findById(req.params.id).populate('students').populate('utilities');
            if(!room) return res.status(404).json({message: 'Room not found'});
            res.status(200).json(room);
        }catch(err){
            res.status(500).json(err);
        }
    },
    updateRoom: async (req, res) => {
        try {
            let imageUrl = "";
            if (req.file) {
                imageUrl = await handleImageUpload(req.file);
            }
    
            const updateData = {
                ...req.body,
                ...(imageUrl && { imageUrl }),
            };
            if (updateData.note === "") delete updateData.note;
            if (updateData.imageUrl === "") delete updateData.imageUrl;
    
            const room = await Room.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
            if (!room) return res.status(404).json({ message: 'Room not found' });
    
            res.status(200).json("Room updated successfully");
        } catch (err) {
            console.log(err);
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
        try {
            const roomId = req.params.id;
            const { waterUsage, electricityUsage, date, status } = req.body;
    
            const room = await Room.findById(roomId);
            if (!room) {
                return res.status(404).json({ message: 'Không tìm thấy phòng' });
            }
    
            const newUtility = {
                waterUsage: waterUsage || 0,
                electricityUsage: electricityUsage || 0,
                date: date ? new Date(date) : Date.now(),
                status: status || 'unpaid',
            };
    
            room.utilities.push(newUtility);
            await room.save();
    
            return res.status(200).json({
                message: 'Thêm utility thành công',
                room,
            });
        } catch (error) {
            console.error('Lỗi khi thêm utility:', error.message);
            return res.status(500).json({ message: 'Lỗi server', error: error.message });
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