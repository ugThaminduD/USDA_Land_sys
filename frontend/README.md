# USDA Land System - Frontend

## Overview

This is the frontend application for the USDA Land System project. It provides a user-friendly interface for uploading, managing, and viewing Excel files and their associated data. The frontend is built using React and integrates with the backend APIs to handle data processing and storage.

## Features

1. **Excel File Upload**:
   - Allows users to upload Excel files through a simple interface.
   - Supports file validation and displays success or error messages.

2. **View Uploaded Files**:
   - Displays a list of all uploaded Excel files with metadata such as file name, topic, and upload date.
   - Provides options to view detailed data for each file.

3. **Data Visualization**:
   - Displays processed Excel data in a tabular format for easy viewing.
   - Supports navigation between different sheets of the uploaded Excel files.

4. **Land Management**:
   - Allows users to input, edit, and view land-related data.
   - Provides a list of land records and detailed views for each record.

5. **Routing**:
   - Implements routing for seamless navigation between different pages, such as file upload, data view, and land management.

## Folder Structure




## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Routing

The application uses React Router for navigation. Below are the main routes:

- `/`: Displays the list of land records.
- `/input`: Allows users to add new land data.
- `/edit/land/:id`: Allows users to edit existing land data.
- `/land/:id`: Displays detailed information about a specific land record.
- `/upload/excelDocument`: Provides an interface for uploading Excel files.
- `/excel/data/view`: Displays processed Excel data.
- `/excel/files`: Lists all uploaded Excel files.
- `/excel/file/:id`: Displays detailed data for a specific Excel file.

## Dependencies

- **React**: For building the user interface.
- **React Router**: For handling routing.
- **Material-UI**: For consistent and responsive UI components.
- **Bootstrap**: For additional styling and layout options.

## Future Development

1. **Enhanced Data Visualization**:
   - Add charts and graphs to visualize Excel data more effectively.

2. **Pagination and Filtering**:
   - Implement pagination and filtering for large datasets.

3. **File Management**:
   - Add options to delete or update uploaded files.

4. **Authentication**:
   - Integrate user authentication for secure access to the application.

5. **Performance Optimization**:
   - Optimize rendering of large datasets to improve performance.

6. **Mobile Responsiveness**:
   - Ensure the application is fully responsive and works seamlessly on mobile devices.

7. **Integration with Backend Enhancements**:
   - Support new features from the backend, such as file versioning and data export.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## License

This project is licensed under the MIT License.