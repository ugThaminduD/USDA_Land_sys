# USDA Land System - Backend

## Overview

This project is part of the USDA Land System, focusing on backend services for handling Excel file uploads, processing, and data management. The backend provides APIs to upload, process, retrieve, and download Excel files, as well as manage their metadata and content.

## Features

The `excelController.js` file implements the following functionalities:

1. **Upload Excel Files**:
   - Handles the upload of Excel files.
   - Validates file size (maximum 100MB).
   - Reads and processes Excel files, supporting multiple sheets.
   - Converts Excel sheets into JSON format and stores them in a MongoDB database.
   - Stores the original Excel file in GridFS for future retrieval.

2. **Retrieve Metadata**:
   - Fetches metadata for all uploaded Excel files, including file name, topic, upload date, sheet name, and parent file.

3. **Retrieve File Data**:
   - Retrieves the processed data for a specific file by its ID.
   - Provides backward compatibility by returning all data from all files in a flattened format.

4. **Download Excel Files**:
   - Allows downloading of the original Excel file stored in GridFS.

## API Endpoints

### 1. Upload Excel File
- **Endpoint**: `/upload/excel_document`
- **Method**: `POST`
- **Description**: Uploads an Excel file, processes its content, and stores it in the database.
- **Request Body**:
  - `file`: The Excel file to upload.
  - `topic`: (Optional) A topic to categorize the file.
- **Response**:
  - Success: `{ success: true, message: "Successfully processed X out of Y sheets" }`
  - Failure: `{ success: false, message: "Error message" }`

### 2. Get All Files Metadata
- **Endpoint**: `/excel/files`
- **Method**: `GET`
- **Description**: Retrieves metadata for all uploaded Excel files.
- **Response**:
  - Success: `{ success: true, files: [...] }`
  - Failure: `{ success: false, message: "Error message" }`

### 3. Get File Data
- **Endpoint**: `/excel/file/:id`
- **Method**: `GET`
- **Description**: Retrieves the processed data for a specific file by its ID.
- **Response**:
  - Success: `{ success: true, fileName, topic, sheetName, parentFile, uploadDate, data }`
  - Failure: `{ success: false, message: "Error message" }`

### 4. Get All Data (Backward Compatibility)
- **Endpoint**: `/data`
- **Method**: `GET`
- **Description**: Retrieves all processed data from all files in a flattened format.
- **Response**:
  - Success: `{ success: true, data: [...] }`
  - Failure: `{ success: false, message: "Error message" }`

### 5. Download Excel File
- **Endpoint**: `/excel/download/:id`
- **Method**: `GET`
- **Description**: Downloads the original Excel file stored in GridFS.
- **Response**:
  - Success: The file is streamed to the client.
  - Failure: `{ success: false, message: "Error message" }`

## Future Development

### Planned Enhancements
1. **Data Validation**:
   - Add schema validation for uploaded Excel files to ensure data consistency.
   - Provide detailed error messages for invalid data formats.

2. **Pagination and Filtering**:
   - Implement pagination and filtering for retrieving metadata and data to handle large datasets efficiently.

3. **File Versioning**:
   - Add support for versioning of uploaded files to track changes over time.

4. **Enhanced Security**:
   - Implement authentication and authorization for API endpoints.
   - Add file encryption for sensitive data.

5. **Data Export**:
   - Provide an option to export processed data back into Excel or other formats (e.g., CSV, JSON).

6. **Performance Optimization**:
   - Optimize the processing of large Excel files to reduce memory usage and improve speed.
   - Implement caching for frequently accessed data.

7. **Error Reporting**:
   - Add detailed logging and error reporting for better debugging and monitoring.

8. **Integration with Frontend**:
   - Develop a user-friendly frontend interface for uploading and managing Excel files.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/USDA_Land_sys.git
   cd USDA_Land_sys/backend

   npm install
   npm ls

   ```