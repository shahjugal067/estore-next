import { NextResponse } from "next/server";

import Review from "@/utils/models/Review";
import dbConnect from "@/utils/config/dbConnection";


export async function GET(req) {
    try {
        await dbConnect();

        const {searchParams }  = new URL(req.url);

        const productId = searchParams.get('productId');
        if(!productId){
            return NextResponse.json({error:"Product id is not found in review"},{status:404});
        }
        const review = await Review.find({product:productId})
        .populate("user","name profileImage")
        .sort({createdAt:-1});

        return NextResponse.json(review);
    } catch (error) {
        return NextResponse.json({error:"Internal server error  found in review"},{status:500});

    }
}