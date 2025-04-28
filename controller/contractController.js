import { Student, Room, Contract } from "../Model/KTXModel.js";

const contractController = {
    addContract: async (req, res) => {
        try {
            const newContract = new Contract(req.body);
            const savedContract = await newContract.save();
    
            if (req.body.student) {
                const student = await Student.findById(req.body.student);
                if (!student) {
                    return res.status(404).json({ message: "Student not found" });
                }
    
                student.contract = savedContract._id; 
                await student.save();
            }
    
            res.status(200).json(savedContract);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    getAllContracts: async (req, res) => {
        try {
            const contracts = await Contract.find();
            res.status(200).json(contracts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    getAContract: async (req, res) => {
        try {
            const contract = await Contract.findById(req.params.id).populate('student room');
            if (!contract) return res.status(404).json({ message: 'Contract not found' });
            res.status(200).json(contract);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteContract: async (req, res) => {
        try {
            await Student.updateMany({ contract: req.params.id }, { contract: null });
            const contract = await Contract.findByIdAndDelete(req.params.id);
            if (!contract) return res.status(404).json({ message: 'Contract not found' });
            res.status(200).json("Contract deleted successfully");
        } catch (err) {
            res.status(500).json(err);
        }
    },
};
export default contractController;