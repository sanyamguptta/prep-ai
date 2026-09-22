const mongoose = require('mongoose');

const connectToDB = async (req, res) => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conneted to DB');
    }
    catch(err) {
        console.log('ERROR connecting to DB: ', err);
    }
}



module.exports = connectToDB;