import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'

const connectDB = async () => {
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`server started host: ${db.connection.host} `)
    } catch (error) {
        console.log('Mongodb Cnnecton Error', error);
        process.exit(1);
    }
}
export default connectDB