import {NextResponse} from 'next/server'
import dbConnect from '@/utils/config/dbConnection';
import Order from '@/utils/models/Order'
import Product  from '@/utils/models/Product'



export async function GET(request,{params}){
    const {orderId} = params;

    await dbConnect()
    try {
        const order = await Order.findById(orderId).populate({
            path:'cartProducts',
            model:"Product"
        });
        if(!order){
            return NextResponse.json({error:"Failed to fetch order"},{status:500})
        }
        return NextResponse.json({order})
    } catch (error) {
        console.log("Error in Fetching order",error)
        return NextResponse.json({
            error:"Internal server error at api/orders/[orderId]"},{status:500})
    }
};
