const mongoose = require("mongoose");


async function connectToDB() {


    try{
        await mongoose.connect(process.env.MONGO_URL)
        .then(()=>{
            console.log("DB connected")
        })
    }
    catch(error){
        console.error("Error from DB : "+ error);
    }
    
} 


module.exports = connectToDB;