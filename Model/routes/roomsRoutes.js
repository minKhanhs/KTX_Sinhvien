import express from 'express';
import { Room } from '../KTXModel.js';

const router = express.Router();

//GET ALL ROOMS 
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 9;  
    const skip = (page - 1) * limit; 

    const totalRooms = await Room.countDocuments(); 
    const rooms = await Room.find()
      .skip(skip)  
      .limit(limit);  

    const totalPages = Math.ceil(totalRooms / limit);  

    res.json({
      rooms,
      currentPage: page,
      totalPages,
      totalRooms
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//GET SINGLE ROOM BY ID 
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//CREATE ROOM 
router.post('/', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid room data', detail: err.message });
  }
});

//UPDATE ROOM 
router.put('/:id', async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({ error: 'Room not found' });
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update room', detail: err.message });
  }
});

//DELETE ROOM 
router.delete('/:id', async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;
