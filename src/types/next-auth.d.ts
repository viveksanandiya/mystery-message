//this page is addon unnecessary optimization & is used 
//in auth/[...nextauth]/options -> callback -> jwt
//trying to put user info into token itself so less db queryies 

//redeclaring or modifing modules of next-auth lib

import "next-auth"
import { DefaultSession } from "next-auth"

declare module 'next-auth'{
    interface User{
        _id?: string
        isVerified?: boolean
        isAcceptingMessages? : boolean
        username? : string
    }

    interface Session{
        user:{
            _id?:string
            isVerified?: boolean
            isAcceptingMessages? : boolean
            username? : string
        } & DefaultSession['user']
    }
}


//declaring JWT so that we can access values from jwt token. we used  it by taking jwt token value for session 
declare module 'next-auth/jwt' {
    interface JWT{
         _id?:string
        isVerified?: boolean
        isAcceptingMessages? : boolean
        username? : string
    }
}

