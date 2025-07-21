import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import CredentialsProvider from "next-auth/providers/credentials";
import { use } from "react";

export const authOptions: NextAuthOptions ={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try{
                    const user = await UserModel.findOne({
                        $or: [//this is just future safe if  we want to find user not just by email but also by other field 
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("no user found with this email")
                    }

                    if(!user.isVerified){
                        throw new Error("please verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("incorrect password")
                    }


                }catch(err: any){
                    throw new Error(err);
                }
            }

        })
    ],

    callbacks:{
        async jwt({ token, user }) {
            //--no need for this optimization . i did it to put info in token so that i dont have to call db everytime & token is more powerful
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            //--

            return token
        },

        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.isVerified = token.isVerified
                session.user.username = token.username
            }
            return session
        },
    },
    
    pages:{// which pages while be handled by nextauth
        signIn: '/sign-in'
    },

    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}

//providers and callbacks are imp