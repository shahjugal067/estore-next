import dbConnect from "@/utils/config/dbConnection";
import User from "@/utils/models/User";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        await dbConnect();

        const {email,name,newEmail} = await req.json();
        
        const updateUser = await User.findOneAndUpdate({
            email
        },{name,email:newEmail},{new:true});

        if(!updateUser) {
            return NextResponse.json({ error:"User not found"},{status:404})
        }
        return NextResponse.json({message:"User updated successfully",user:updateUser});

    } catch (error) {
        return NextResponse.json({error:"Error in updating user"},{status:500})
    }
}