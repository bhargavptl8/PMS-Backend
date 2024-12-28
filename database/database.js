const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        let response = await mongoose.connect(uri || process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME
        });
        console.log(`MongoDB connected with ${response?.connections?.[0]?.name}`);
    } catch (error) {
        console.log("error", error);
    }
}

module.exports = connectDB;