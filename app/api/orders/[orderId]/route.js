import {NextResponse} from 'next/server'
import dbConnect from '@/utils/config/dbConnection';
import Order from '@/utils/models/Order'



export async function GET(request,{params}){
    const {orderId} = params;

    await dbConnect()
    try {
        const order = await Order.findById(orderId).populate({
            path:''
        })
    } catch (error) {
        console.log("Error in Fetching order",error)
        return NextResponse.json({
            error:"Internal server error at api/orders/[orderId]"},{status:500})
    }
};
