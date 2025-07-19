import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;    //here string is in small letters as it is in TS while others are for Mongoose
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required: [true, "Username is required"],
        trim: true,
        unique:true
    },
    email: {
        type:String,
        required: [true, "Email is required"],
        unique:true,
        match: [ /.+\@.+\..+/,'please use a valid email']   //check valid email
    },
    password: {
        type:String,
        required: [true, "Password is required"]
    },
    verifyCode:{
        type:String,
        required: [true, "verify code is required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "verify code is required"]
    
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)    // if created already get model ELSE create model

export default UserModel;