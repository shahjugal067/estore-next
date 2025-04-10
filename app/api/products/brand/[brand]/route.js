import dbConnect from "@/utils/config/dbConnection";
import Product from "@/utils/models/Product";
import { NextResponse } from "next/server";




export async function GET(req,{params}) {
    await dbConnect();
    const { brand } = params;
    try {
        function createFlexiableSearchPattern(input){
            const stripped = input.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").toLowerCase();
            return stripped.split(" ").join("\\s+");

        }

        const flexiablePattern = createFlexiableSearchPattern(brand);

        const brandRegex = new RegExp(flexiablePattern,'i');

        const foundProducts = await Product.find({brand:{$regex:brandRegex}})
        .populate("user").sort({createdAt:-1});

        if(foundProducts && foundProducts.length > 0 ){
            return NextResponse.json(foundProducts);
        }else{
            return NextResponse.json({error:"No products found for this brand"},{status:404})
        }
    } catch (error) {

        return NextResponse.json({error:"Error in fetching brand products"},{status:404})
    }
};