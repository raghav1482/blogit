import mongoose from 'mongoose';

let isConn = false;

export const connectDB = async()=>{
    mongoose.set('strictQuery',true);
    if(isConn){
        console.log("DB connected");
        return;
    }
    try{
        await mongoose.connect(process.env.DB,{
            dbName:"share_prompt",
            useNewUrlParser:true,
            useUnifiedTopology:true
        }) 
        isConn=true
        console.log('MDB connected');

    }catch(e){
        console.log(e);
    }
}