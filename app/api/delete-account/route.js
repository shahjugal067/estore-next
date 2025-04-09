import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/utils/config/dbConnection";
import User from "@/utils/models/User";


export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({error:"Not authonticated"},{status:401});
    }
    await dbConnect();
    try {
        if(!session.user._id){
            return NextResponse.json({ error:"User id not found in session"},{status:404})
        }

        const deleteUser = await User.findByIdAndDelete(session.user._id)
        if(!deleteUser){
            return NextResponse.json({error:"User not found"},{status:404});
        }
        return NextResponse.json({message:"User deleted successfully"})
        
    } catch (error) {
        return NextResponse.json({error:"Failed to delete account"},{status:500})
    }
}
