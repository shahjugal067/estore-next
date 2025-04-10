import dbConnect from "@/utils/config/dbConnection";
import Product from "@/utils/models/Product";
import { NextResponse } from "next/server";


export async function GET(req,res) {
    await dbConnect()

    const foundProducts = await Product.find({})
    .populate("user").sort({createdAt: -1});

    if(foundProducts){
        return NextResponse.json(foundProducts)
    }else{
         return new NextResponse.json({error:"Cant find products"},{status:404});
    }
};

export async function POST(req,res) {
    await dbConnect()

    const body = await req.json()
    const {name,description,images,brand,price,originalPrice,material,
        bracelet, condition,water,lugs,crown,casematerial,bandsize,luminova,
        thickness, glass,movement,featured,user,category,
             } = body;

    const newProduct = await Product.create({name,description,images,brand,price,originalPrice,material,
        bracelet, condition,water,lugs,crown,casematerial,bandsize,luminova,
        thickness, glass,movement,featured,user,category,});

        console.log("new product created",newProduct)
        const savedProduct = await newProduct.save();
        return NextResponse.json({message:"Product created success",success: true, savedProduct})
};