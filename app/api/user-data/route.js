import dbConnect from "@/utils/config/dbConnection";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/utils/models/User";


export async function GET(req) {
    const session = await getServerSession(authOptions);

    if(!session) {
        return NextResponse.json({error:"Not authenticate or user not load"},{status:404})
    }
    await dbConnect()

    try {
    
        const user = await User.findOne({email:session.user.email}).select("-password");

        if(!user) {
            return NextResponse.json({error:"User not found"},{status:404})
        }
        return NextResponse.json(user);

    } catch (error) {
        return NextResponse.json({error:"Internal Error in geting user data"},{status:500})
    }
};