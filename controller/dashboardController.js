import {Utility,Student, Room } from "../Model/KTXModel.js";
const dashboardController = {
    getUtilities: async (req, res) => {
        try{
            const result = await Utility.aggregate([
                {
                    $group:{
                        _id: {
                            year: {$year: '$date'},
                            month: {$month: '$date'},
                        },
                        totalElectricity: {$sum: '$electricityUsage'},
                        totalWater: {$sum: '$waterUsage'},
                    },
                },
                {$sort: {'_id.year': 1, '_id.month': 1}}
            ]);
            return res.status(200).json(result);
        }catch(err){
            res.status(500).json(err);
        }
    },
    getTotalStudents: async (req, res) => {
        try {
          const count = await Student.countDocuments({});
          res.json({ totalStudents: count });
        } catch (err) {
          res.status(500).json({ message: 'Server error', error: err });
        }
    },
    getRoomStats: async (req, res) => {
        try {
          const totalRooms = await Room.countDocuments({});
          const fullRooms = await Room.countDocuments({
            $expr: { $eq: [{ $size: '$students' }, '$maxStudents'] }
          });
          const emptyRooms = totalRooms - fullRooms;
      
          res.json({
            totalRooms,
            fullRooms,
            emptyRooms,
          });
        } catch (err) {
          res.status(500).json({ message: 'Server error', error: err });
        }
    },

}
export default dashboardController;