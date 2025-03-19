const LandModel = require('../models/Land');

// Create a new land entry
const createLand = async (req, res) => {
    try {
        const land = new LandModel(req.body);
        await land.save();
        res.status(201).json({ message: 'Land entry created successfully', land });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all land entries
const getAllLands = async (req, res) => {
    try {

        const { Provinces, Districts, Divisional_secretariats, Land_owner_name } = req.query;
        let query = {};

        if (Provinces) query.Provinces = { $regex: Provinces, $options: 'i' }; // Case-insensitive search
        if (Districts) query.Districts = { $regex: Districts, $options: 'i' };
        if (Divisional_secretariats) query.Divisional_secretariats = { $regex: Divisional_secretariats, $options: 'i' };
        if (Land_owner_name) query.Land_owner_name = { $regex: Land_owner_name, $options: 'i' };

        const lands = await LandModel.find(query);
        res.status(200).json(lands);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single land entry by id
const getLandById = async (req, res) => {
    try {
        const land = await LandModel.findById(req.params.id);
        if (!land) return res.status(404).json({ message: 'Land not found' });
        res.status(200).json(land);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a land entry by id
const updateLand = async (req, res) => {
    try {
        const land = await LandModel.findByIdAndUpdate(req.params.id, req.body, 
            { 
                new: true, 
                runValidators: true 
            });

        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }
        res.status(200).json({ message: 'Land updated successfully', land });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a land entry by id
const deleteLand = async (req, res) => {
    try {
        const land = await LandModel.findByIdAndDelete(req.params.id);
        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }
        res.status(200).json({ message: 'Land deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { 
    createLand, getAllLands, getLandById, updateLand, deleteLand 
};