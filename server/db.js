const {  mongoose } = require("mongoose");
const { config } = require('dotenv');
const Hostel = require("./models/Hostel");
const { Inventory } = require("./models/Inventory");


// const { CleaningChart } = require('./models/CleaningChart')

config();
const connectDB = async ()=>{
    try{
        const uri = process.env.MONGODB_URI;
  //         console.log('MongoDB URI:', uri);
        await mongoose.connect(uri,{
            useNewUrlParser: true,
      useUnifiedTopology: true,
        })
        console.log("connect to mongo");
    }
    catch(error){
        console.error('Error connecting to MongoDB:', error);
    process.exit(1);
    }
}

module.exports={  connectDB  ,Hostel, Inventory }

