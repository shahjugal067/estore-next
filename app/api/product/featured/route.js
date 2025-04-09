import { NextResponse } from "next/server";
import dbConnect from "@/utils/config/dbConnection";
import Product from "@/utils/models/Product";


export async function GET(req){
    await dbConnect()

    try {
        
        const featuredProduct = await Product.findOne({featured:true})
        
        if(!featuredProduct){

            return NextResponse.json({error:"No featured product found"},{status:404});        

        }
        return NextResponse.json(featuredProduct);

    } catch (error) {
        
        return NextResponse.json({error:"Internal server error at updating featuring product"},{status:500});        

    }
};