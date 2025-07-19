import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req : Request){
    await dbConnect();

    try{
        const {username , email , password} = await req.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if( existingUserVerifiedByUsername ){
            return Response.json({
                success: false, 
                message: "Username already register"
            }, {status: 400 })
        }

        const exisitinguserByEmail = await UserModel.findOne({email});

        const verifyCode = Math.floor(100000 + Math.random()* 900000).toString();

        if(exisitinguserByEmail){
            if(exisitinguserByEmail.isVerified){
                return Response.json({
                success: false,
                message: "User already exist with this email"
            }, {status: 400}) 
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 5);

                exisitinguserByEmail.password = hashedPassword;
                exisitinguserByEmail.verifyCode = verifyCode;

                const expiryDate = new Date() 
                expiryDate.setHours(expiryDate.getHours() + 1)
                exisitinguserByEmail.verifyCodeExpiry = expiryDate;

                await exisitinguserByEmail.save()
            }

        }else{
            const hashedPassword = await bcrypt.hash(password, 5);

            const expiryDate = new Date() 
            //we are getting Date as object and object in memory is a reference point and its value can be changed even if it is const , let ...
            expiryDate.setHours(expiryDate.getHours() + 1)  //set 1 hr expiry

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,     
                verifyCode, 
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        //send verification email
        const emailResponse =  await sendVerificationEmail(
            email, 
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User registration successfully !"
        }, {status: 201})

    }catch(error){
        console.error('error registering user', error);
        return Response.json({
            success:false,
            message:"Error registering user"
        },{status: 500})
    }
}