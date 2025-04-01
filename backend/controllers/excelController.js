const XLSX = require("xlsx");
const DataModel = require("../models/ExcelData");
const { getBucket } = require('../config/gridfs.js');
const { Readable } = require('stream');

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

const uploadExcel = async (req, res) => {
  try {
    // Check file size
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size allowed is 100MB"
      });
    }

    // Validate file buffer
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid file buffer"
      });
    }

    const fileName = req.file.originalname;
    const topic = req.body.topic || "General";

    // Determine correct MIME type based on file extension
    const isXLSX = fileName.toLowerCase().endsWith('.xlsx');
    const mimeType = isXLSX 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/vnd.ms-excel';
    

    // Create a readable stream from buffer
    const readableFileStream = new Readable();
    readableFileStream.push(req.file.buffer);
    readableFileStream.push(null);

    // Store file in GridFS
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: mimeType,
      metadata: {
        originalName: fileName,
        mimeType: mimeType
      }
    });

    const storeFilePromise = new Promise((resolve, reject) => {
      readableFileStream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => resolve(uploadStream.id));
    });

    // Wait for file to be stored
    const fileId = await storeFilePromise;

    let workbook;
    try {
      workbook = XLSX.read(req.file.buffer, { 
        type: "buffer",
        cellDates: true,
        cellNF: false,
        cellText: false,
        WTF: true, // More detailed errors
        codepage: 65001, // UTF-8
        dateNF: 'yyyy-mm-dd', // Standardize date format
        raw: true,
        sheetStubs: true,
        sheets: true
      });
    } catch (error) {
      console.error("Excel reading error:", error);
      return res.status(400).json({
        success: false,
        message: "Unable to read Excel file. Please ensure the file is not corrupted and try again."
      });
    }

    // Validate workbook
    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Excel file structure. No sheets found."
      });
    }

    // Handle multiple sheets
    if (workbook.SheetNames.length > 1) {
      try {
        const uploadPromises = workbook.SheetNames.map(async (sheetName) => {
          try {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) {
              console.error(`Sheet "${sheetName}" not found`);
              return null;
            }

            let jsonData;
            try {
              jsonData = XLSX.utils.sheet_to_json(sheet, {
                raw: true,
                dateNF: 'yyyy-mm-dd',
                defval: '',
                blankrows: false,
                header: 1 // Use first row as headers
              });

              // Remove empty rows and process data
              jsonData = jsonData.filter(row => row.some(cell => cell !== ''));

              // Convert array format to object format with headers
              if (jsonData.length >= 2) {
                const headers = jsonData[0];
                const dataRows = jsonData.slice(1);
                
                jsonData = dataRows.map(row => {
                  const rowData = {};
                  headers.forEach((header, index) => {
                    if (header) {
                      rowData[header.toString().trim()] = row[index] || '';
                    }
                  });
                  return rowData;
                });
              } else {
                return null;
              }
            } catch (jsonError) {
              console.error(`Error converting sheet "${sheetName}" to JSON:`, jsonError);
              return null;
            }

            // Skip empty sheets
            if (!jsonData || jsonData.length === 0) {
              return null;
            }
            
            const newExcelData = new DataModel({
              fileName: `${fileName} - ${sheetName}`,
              topic,
              sheetName,
              parentFile: fileName,
              excelFileId: fileId,
              mimeType: mimeType, 
              data: jsonData
            });
            
            return newExcelData.save();
          } catch (sheetError) {
            console.error(`Error processing sheet "${sheetName}":`, sheetError);
            return null;
          }
        });
        
        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter(result => result !== null);

        if (successfulUploads.length === 0) {
          return res.status(400).json({
            success: false,
            message: "No valid data found in any sheet. Please check the file content."
          });
        }

        res.json({ 
          success: true, 
          message: `Successfully processed ${successfulUploads.length} out of ${workbook.SheetNames.length} sheets`
        });
      } catch (error) {
        throw new Error(`Error processing multiple sheets: ${error.message}`);
      }
    } else {
      // Single sheet processing
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      if (!sheet) {
        return res.status(400).json({
          success: false,
          message: "Sheet not found in Excel file"
        });
      }

      let jsonData;
      try {
        jsonData = XLSX.utils.sheet_to_json(sheet, {
          raw: true,
          dateNF: 'yyyy-mm-dd',
          defval: '',
          blankrows: false,
          header: 1
        });

        if (jsonData.length >= 2) {
          const headers = jsonData[0];
          const dataRows = jsonData.slice(1);
          
          jsonData = dataRows.map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
              if (header) {
                rowData[header.toString().trim()] = row[index] || '';
              }
            });
            return rowData;
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Excel file must contain at least a header row and one data row"
          });
        }
      } catch (jsonError) {
        console.error("Error converting sheet to JSON:", jsonError);
        return res.status(400).json({
          success: false,
          message: "Error processing Excel data. Please check the file format."
        });
      }

      if (!jsonData || jsonData.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid data found in Excel file"
        });
      }
      
      try {
        const newExcelData = new DataModel({
          fileName,
          topic,
          sheetName,
          excelFileId: fileId,
          mimeType: mimeType,
          data: jsonData
        });
        
        await newExcelData.save();
        res.json({ success: true, message: "Data inserted successfully" });
      } catch (saveError) {
        console.error("Error saving to database:", saveError);
        throw new Error("Error saving data to database");
      }
    }
  } catch (error) {
    console.error("Excel upload error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error processing Excel file: " + (error.message || "Unknown error")
    });
  }
};

// Get all Excel files with their metadata
const getFiles = async (req, res) => {
  try {
    const files = await DataModel.find({}, { 
      fileName: 1, 
      topic: 1, 
      uploadDate: 1,
      sheetName: 1,
      parentFile: 1
    });
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get data for a specific file
const getFileData = async (req, res) => {
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
      sheetName: fileData.sheetName,
      parentFile: fileData.parentFile, 
      uploadDate: fileData.uploadDate,
      data: fileData.data 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all data (backward compatibility)
const getData = async (req, res) => {
  try {
    const allData = await DataModel.find({});
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

// Download Excel file
const downloadExcel = async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileData = await DataModel.findById(fileId);
    
    if (!fileData) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const bucket = getBucket();
    
    // Get the file info from GridFS
    const files = await bucket.find({ _id: fileData.excelFileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ success: false, message: "File not found in storage" });
    }

    const downloadStream = bucket.openDownloadStream(fileData.excelFileId);

    // Determine the correct MIME type based on file extension
    const isXLSX = fileData.fileName.toLowerCase().endsWith('.xlsx');
    const mimeType = isXLSX 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/vnd.ms-excel';

    // Set the correct headers
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileData.fileName}"`,
      'Content-Transfer-Encoding': 'binary',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, no-transform, no-store, must-revalidate'
    });

    // Pipe the file directly to the response
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error downloading file: " + error.message 
    });
  }
};



module.exports = {
  uploadExcel,
  getFiles,
  getFileData,
  getData,
  downloadExcel
};