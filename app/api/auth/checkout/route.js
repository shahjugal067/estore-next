import { NextResponse } from "next/server";
import dbConnect from "@/utils/config/dbConnection";
import Order from "@/utils/models/Order";

import Stripe from "stripe";
import Product from "@/utils/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
    try {
        await dbConnect()

        const body = await req.json();
        const { name,email,city,postalCode,streetAddress,country,cartItems,user } = body
        if(!cartItems || cartItems.length === 0){
            return NextResponse.json({error:"Cart is empty"},{status:400});
        }
        console.log("Cart Items",cartItems)
        const productIds = cartItems.map((item)=> item.id);
        const uniqueIds = [...new Set(productIds)];
        console.log("Unique ids",uniqueIds)

        let productInfos;

        try {
            productIds = await Product.find({_id: { $in: uniqueIds}});
            console.log("Found products",productInfos)

        } catch (error) {
            return NextResponse.json({error:"error fetching products"},{status:500})
        }
        if(!productInfos || productInfos.length === 0){
            return NextResponse.json({error:"No product found"},{status:404})
        }
        let line_items= [];
        let total = 0;
        let orderCartProducts =[];

        for(const cartItem of cartItems){
            const productInfo = productInfos.find((p)=> p._id.toString() === cartItem.id);

            if(productInfo){
                const quantity = cartItem.quantity || 0 ;
                if(quantity > 0){
                    total += productInfo.price * quantity;
                    line_items.push({
                        price_data:{
                            currency:"usd",
                            product_data:{
                                name:productInfo.name,
                            },
                            unit_amount: Math.round(productInfo.price * 100),
                        },
                        quantity: quantity,
                    });
                    orderCartProducts.push({
                        product: productInfo._id,
                        quantity: quantity,
                        price: productInfo.price,
                    })
                }
            }else{
                console.log("Product id not found",cartItem._id)
            }
        }

        let orderDoc;
        try {
            orderDoc = await Order.create({
                name,email,city,postalCode,
                streetAddress,country,paid:false,
                cartProducts:orderCartProducts,total,user,
            });
            console.log("Order created",orderDoc)
        } catch (error) {
            return NextResponse.json({error:" errror in creating order"},{status:500})

        }
        let session;
        try {
            session = await stripe.checkout.sessions.create({
                payment_method_types:['card'],
                line_items,
                mode:'payment',
                success_url:`${process.env.NEXT_PUBLIC_URL}/checkout/success?orderId=${orderDoc._id}`,
                cancel_url:`${process.env.NEXT_PUBLIC_URL}/checkout/canceled`,
                metadata:{
                    orderId:orderDoc._id.toString(),
                }
            });
            console.log("Stripe session created",session.id);
        } catch (error) {
            return NextResponse.json({error:"Error in stripe session creation"},{status:500});

        }
        return NextResponse.json({url:session.url});

    } catch (error) {
        return NextResponse.json({error:"Internal server error at api checkout",detail:error.message},{status:500});

    }
}