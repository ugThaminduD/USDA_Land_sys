const XLSX = require("xlsx");
const DataModel = require("../models/ExcelData");

// Process and save Excel data
exports.uploadExcel = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Get file information
    const fileName = req.file.originalname;
    const topic = req.body.topic || "General";
    
    // Create new Excel data document
    const newExcelData = new DataModel({
      fileName,
      topic,
      data: jsonData
    });
    
    await newExcelData.save();
    res.json({ success: true, message: "Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all Excel files with their metadata
exports.getFiles = async (req, res) => {
  try {
    const files = await DataModel.find({}, { fileName: 1, topic: 1, uploadDate: 1 });
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get data for a specific file
exports.getFileData = async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileData = await DataModel.findById(fileId);
    
    if (!fileData) {
      return res.status(404).json({ success: false, message: "File not found" });
    }
    
    res.json({ 
      success: true, 
      fileName: fileData.fileName, 
      topic: fileData.topic, 
      uploadDate: fileData.uploadDate,
      data: fileData.data 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all data (backward compatibility)
exports.getData = async (req, res) => {
  try {
    const allData = await DataModel.find({});
    // Flatten all data for backward compatibility
    let flattenedData = [];
    allData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        flattenedData = [...flattenedData, ...file.data];
      }
    });
    res.json({ success: true, data: flattenedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// You can add more controller functions as needed
exports.getData = async (req, res) => {
  try {
    const data = await DataModel.find({});
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};