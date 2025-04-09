import dbConnect from "@/utils/config/dbConnection";
import { NextResponse } from "next/server";


export async function GET(req,res) {
    await dbConnect()

    const { params } = res;
    const searchTerm = params?.search;

    function createFlexiableSearchRegex(searchTerm){
        const escapeSearchTerm = searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    }
    
    try {
        
    } catch (error) {
        return NextResponse.json({error:"Error in search items"},{status:500})
    }
}