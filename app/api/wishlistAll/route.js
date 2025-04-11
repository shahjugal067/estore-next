import dbConnect from "@/utils/config/dbConnection";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/utils/models/User";
import Product from "@/utils/models/Product";


export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({error:"Not authenticated"},{status:404});
        }

        await dbConnect();

        const user = await User.findOne({_id:session.user._id});
        if(!user){
            return NextResponse.json({error:"User not found"},{status:404});
        }
        const wishlistItems = await Product.find({
            _id:{$in:user.wishlist},
        });
        return NextResponse.json({ items:wishlistItems})
    } catch (error) {
        return NextResponse.jso({error:"Inernal Error in fetching all wishlist"},{status:500})
    }
}

export async function POST(req) {
    try {
       const session = await getServerSession(authOptions);
       if(!session) {
        return NextResponse.json({error:"Not authenticated"},{status:404});
       } 

       await dbConnect();

       const {productId} = await req.json()

       if(!productId) {
        return NextResponse.json({error:"Product id not found "},{status:404})
       }

       const user = await User.findOne({_id:session.user._id});
       if(!user){
        return NextResponse.json({error:"User not found"},{status:404});
       }
       const product = await Product.findById(productId);
       if(!product){
        return NextResponse.json({error:"Product not found "},{status:404})
       }
       if(!user.wishlist.includes(productId)){
        user.wishlist.push(productId);
        await user.save();
       }
       return NextResponse.json({message:"Product added to wishlist"},{status:200})

    } catch (error) {
        return NextResponse.jso({error:"Inernal Error in fetching all wishlist"},{status:500})

    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({error:"Not authenticated"},{status:401})
        }
        await dbConnect();

        const {productId } = await req.json();

        if(!productId){
            return NextResponse.json({error:"Product id is not found"},{status:404})
        }
        const user = await User.findOne({email:session.user.email});
        if(!user){
            return NextResponse.json({error:"User not found"},{status:404});
        }
        user.wishlist = user.wishlist.filter((id)=> id.toString() !== productId);
        await user.save();
        return NextResponse.json({message:"Product removed from wishlist successfull"},{status:200})

    } catch (error) {
        return NextResponse.json({error:"Error in fetching wishlists"},{status:500})
    }
}