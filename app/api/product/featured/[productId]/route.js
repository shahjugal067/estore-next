import { NextResponse } from "next/server";
import dbConnect from "@/utils/config/dbConnection";
import Product from "@/utils/models/Product";



export async function GET(req) {
    await dbConnect()

    try {
        const featuredProduct = await Product.findById({featured:true});

        return NextResponse.json(featuredProduct)

    } catch (error) {
        return NextResponse.json({error:"Internal server error at api featuring product"},{status:500});        

    }
};

export async function PUT(req,{params}) {
    await dbConnect()

    const { productId }  = params;
    try {
        const updatedFeaturedProduct =  await Product.updateMany({featured: true},{featured:false})
        console.log(updatedFeaturedProduct);

        const updatedProduct = await Product.findByIdAndUpdate(productId,{featured:true},{new:true})
        console.log(updatedProduct);

        if(!updatedProduct){
            return NextResponse.json({error:"Error in updating featured products"},{status:404})
        }
        return NextResponse.json(updatedProduct)

    } catch (error) {
        return NextResponse.json({error:"Internal server error at updating featuring product"},{status:500});        

    }
}