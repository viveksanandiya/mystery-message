import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: Request){
    //TODO: use this in all other routes
    if(req.method !== 'GET'){
        return Response.json({
            success: false,
            message: 'Method not allowed'
        }, {status: 405})
    }

    try{
            
        await dbConnect()

        const { searchParams } = new URL(req.url) 
        //getting search param from url then geting username from that below  
        const queryParam ={
            username: searchParams.get('username')
        }

        //zod validate
        const result = UsernameQuerySchema.safeParse(queryParam);

        if(!result.success){
            return Response.json({
                success: false,
                message: 'invalid query parameter'
            }, {status: 400})
        }

        const username = result.data.username;

        const existingVerifiedUser = await UserModel.findOne({
            username: username, isVerified: true
        })

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'Username is taken '
            },{status: 400})
        }

        return Response.json({
                success: true,
                message: 'Username is available'
            },{status: 400})

    }catch(err){
        return Response.json({
            success: false,
            messsage: "Error checking username"
        },{status: 500})
    }
}