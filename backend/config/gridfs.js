const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let bucket;

const initGridFS = (db) => {
    bucket = new GridFSBucket(db, {
        bucketName: 'excelFiles'
    });
};

// Initialize GridFS when MongoDB connects
mongoose.connection.once('open', () => {
    initGridFS(mongoose.connection.db);
});

module.exports = {
    getBucket: () => {
        if (!bucket) {
            throw new Error('GridFS not initialized');
        }
        return bucket;
    },
};
