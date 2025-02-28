import mongoose from "mongoose";


const connectMongo=()=>{
    mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log('Connected to MongoDB');
    })
}
export default connectMongo