import { resend } from "@/lib/resend"; 
import VerificationEmailTemplate from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email: string ,
    username: string,
    verifyCode: string // otp
): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery message | Verification code',
            react: VerificationEmailTemplate({ username, otp :verifyCode }),
        });

        return {success: true, message: 'Verification email'}
    }catch(emailError){
        console.error("error sending verification email", emailError)
        return {success: false, message: 'failed to send verification email'}
    }
}