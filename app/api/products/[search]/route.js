import dbConnect from "@/utils/config/dbConnection";
import Product from "@/utils/models/Product";
import { NextResponse } from "next/server";


export async function GET(req,res) {
    await dbConnect()

    const { params } = res;
    const searchTerm = params?.search;

    function createFlexiableSearchRegex(searchTerm){
        const escapeSearchTerm = searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        const regexPatern = escapeSearchTerm.splite(" ").join("\\s");
        return new RegExp(regexPatern,"i"); /// case insensitive

    }
    const searchTermRegex = createFlexiableSearchRegex(searchTerm);
    const foundProducts = await Product.find({
        $or: [
            {name:{$regex:searchTermRegex}},
            {description:{$regex:searchTermRegex}},
        ],
    }).populate("user").sort({createdAt:-1});
    if(foundProducts){
        return NextResponse.json(foundProducts)
    }else{
        return NextResponse.json({error:"No Products found for this search"},{status:404})
    }
   
};