import dbConnect from "@/utils/config/dbConnection";
import User from "@/utils/models/User.js";
import bcryptjs from 'bcryptjs'
import { NextResponse } from "next/server";


const DEFAUL_PROFILE_IMAGE =  "https://cdn.pixabay.com/photo/2022/10/02/01/58/technology-7492577_640.jpg";

export async function POST(request) {
    try {
        await dbConnect();
        const { name,email,password } = await request.json();
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({error:"User already registered"},{status:400});
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);
        const newUser = new User({
            email,password:hashedPassword,name,
            profileImage: DEFAUL_PROFILE_IMAGE,
        });
        const saveUser = await newUser.save();

        return NextResponse.json({
            message:"User registered successfull ",
             success: true,
              saveUser
            });
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"Error in registering user or server error"},{status:500})
    }
}