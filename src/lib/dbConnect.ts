import mongoose from "mongoose"

type ConnectionObject = {
    isConnected? : number
}

const connection: ConnectionObject ={}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("already connect to db");
        return
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URL || '')

        connection.isConnected = db.connections[0].readyState   //just because i took isConnected: number so exacting num using readyState

        console.log("db connected successfully ! ");
    

    }catch(error){
    console.log("db connection failed ")
        process.exit(1);
    }
}

export default dbConnect;