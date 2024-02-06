const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected succesfully !");
  } catch (error) {
    console.log("Error while connecting mongodb", error.message);
  }
};

module.exports = connectDB;

// Use if they required
// {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
