import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../api/auth/[...nextauth]/route";
import bcryptjs from 'bcryptjs'
import User from "@/utils/models/User";
import dbConnect from "@/utils/config/dbConnection";

export async function POST(req) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    if(!session) {
        return NextResponse.json({error:"Not Authenicated"},{status:400})

    }
    const body = await req.json();

    const {currentPassword, newPassword } = body;
    if(!currentPassword || newPassword){
        return NextResponse.json({error:"Missing fields"},{status:400});
    }
    const user = await User.findOne({email:session.user?.email});
    if(!user){
        return NextResponse.json({error:"User not found"},{status:404})
    }
    const isPasswordValid = await bcryptjs.compare(currentPassword,user.password)
    if(isPasswordValid){
        return NextResponse.json({error:"Password doesnot mathc"},{status:404});
    }
    const hashedPassword = await bcryptjs.hash(newPassword,10);
    await User.findByIdAndUpdate(user._id,{password:hashedPassword});

    return NextResponse.json({message:"User password updated successfull"});
}

