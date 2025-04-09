import { NextResponse } from "next/server";
import dbConnect from "@/utils/config/dbConnection";
import { Product } from "@/utils/models/Product";

export async function GET(req,{params}) {
    await dbConnect();
    const {productId} = params;

    try {
        const product = await Product.findById(productId);
        if(!product){
            return NextResponse.json({
                error:"Product not found"
            },{status:404});
        }
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({erro:"Error in fetching product"},{status:500})
    }
};

export async function PUT(req,{params}) {
    await dbConnect();
    const { productId } = params;
    const body = await req.json();

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId,body,
            {new:true, runValidators: true});

            if(!updatedProduct){
                return NextResponse.json({error:"Product not found"},{status:404});
            }

            return NextResponse.json(updatedProduct);

    } catch (error) {
        return NextResponse.json({error:"Error in updating product"},{status:500});
    }
};

export async function DELETE(req,{params}) {
    await dbConnect();
    const { productId } = params;
    
    try {
        const deleteProduct = await Product.findByIdAndDelete(productId);
        
        if(!deleteProduct){
            return NextResponse.json({error:"Product not found"},{status:404});

        }
        return NextResponse.json({message:"Product deleted successfully"});

    } catch (error) {
        return NextResponse.json({error:"Error in deleting product"},{status:500});

    }
};