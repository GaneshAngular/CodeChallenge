const mongoose = require('mongoose');

const connectMongo=()=>{
    mongoose.connect(process.env.DATABASE_URL,()=>{
        console.log('Connected to MongoDB');
    })
}
export default connectMongo