import {Room, Utility} from '../Model/KTXModel.js';

const utilityController = {
    addUtilities: async (req, res) => {
        try {
            const newUtility = new Utility(req.body);
            const savedUtility = await newUtility.save();
            if(req.body.room) {
                const room = await Room.findById(req.body.room);
                if(!room) return res.status(404).json({message: 'Room not found'});
                //Nếu phong có hơn 3 hóa đơn thì xóa hóa đơn lâu nhất
                if(room.utilities.length >= 3) {
                    const removeUtilityId = room.utilities.shift();
                    await Utility.findByIdAndDelete(removeUtilityId);
                }
                room.utilities.push(savedUtility._id);
                await room.save();
            }
            res.status(200).json(savedUtility);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    updateUtility: async (req, res) => {
            try{
                const utility = await Utility.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
                if(!utility) return res.status(404).json({message: 'Utility not found'});
                res.status(200).json("Utility updated successfully");
            }catch(err){
                res.status(500).json(err);
            }
        },

}
export default utilityController;
