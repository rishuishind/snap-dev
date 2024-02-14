import mongoose, { Connection } from "mongoose";

let catchedConnection:Connection|null = null;

export async function connectToMongoDB(){
    if(catchedConnection){
        console.log('Connected using catched connection');
        return catchedConnection;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        catchedConnection = conn.connection;
        console.log('New MongoDB connection established');
        return catchedConnection;
    } catch (error) {
        console.log(error);
        throw error;
    }
}