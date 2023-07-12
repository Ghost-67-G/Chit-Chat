const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // "mongodb+srv://AyanNaseer:Ghost-67@combinedb.x23qgg7.mongodb.net/ChatApp?retryWrites=true&w=majority"
    const uri =process.env.MONGOOSE_ADDRESS;
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
