import dbConnect from "@/utils/config/dbConnection";
import Product from "@/utils/models/Product";
import { NextResponse } from "next/server";

export async function GET(req){
    await dbConnect()

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || 1);
    const limit = parseInt(searchParams.get('limit')|| 12);

    const skip = (page -1) * limit;

    try {
        const totalProducts = await Product.countDocuments();
        const foundProducts = await Product.find({})
        .populate("user").sort({createdAt}).skip(skip).limit(limit);

        if(foundProducts){
            return NextResponse.json({products:foundProducts, 
                total:totalProducts,
                page:page,
                totalPages: Math.ceil(totalProducts / limit),
            });
        }else{
            return new NextResponse.json({error:"Product not found"},{status:404});
        }
    } catch (error) {
        return NextResponse.json({error:"Error in fetching products"},{status:500});
    }
};