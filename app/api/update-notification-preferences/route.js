import dbConnect from "@/utils/config/dbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import User from "@/utils/models/User";



export async function POST(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if(!session) {
        return NextResponse.json({canReview:false},{status:200})
    }
    const body = await req.json();
    const {orderUpdates,promotions} = body;

    try {
        const user = await User.findOneAndUpdate({
            email:session.user.email,
        },
    {
        $set:{ "notificationPreferences.orderUpdates": orderUpdates,
            "notificationPreferences.promotions":promotions,
        },
    },{new:true},
);

    if(!user) {
        return NextResponse.json({error:"User not found"},{status:404})
    }
    return NextResponse.json({ message:"Preferences updated",preferences:user.notificationPreferences});

    } catch (error) {
        return NextResponse.json({error:"Internal server errror in updating notifiction"},{status:500})
    }
};