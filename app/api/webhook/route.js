import dbConnect from "@/utils/config/dbConnection";
import Order from "@/utils/models/Order";
import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    await dbConnect();
    let event;
    try {
        const body = await req.json();
        const signature = req.headers.get("stripe-signature");

        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log("Webhook event create successful",signature);



    } catch (error) {
        return NextResponse.json({error:"Error in webhook"},{status:500});
    }
    // handle the event 
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            await handleSuccessfulPayment(session);
            break;
        case "payment_intent.succeeded":
             const paymentIntent = event.data.object;
             await handleSuccessfulPayment(paymentIntent);
             break;

             default:
                console.log("Unhandle event type",event.type)

    }
    return NextResponse.json({reciept: true},{status:200})
}

async function handleSuccessfulPayment(paymentObject) {
    let orderId;

    if(paymentObject.object === "checkout.session") {
        orderId = paymentObject.metadata.orderId;
    }else if(paymentObject.object === "payment_intent"){
        orderId = paymentObject.metadata.orderId;
    }
    if(!orderId) {
        console.log("No order id found in payment object")
        return;
    }
    try {
        
        const updateOrder = await Order.findByIdAndUpdate(orderId,{paid:true},{new:true});

        if(!updateOrder) {
            console.log(`No order found with this id ${orderId}`);
            return;
        }
        console.log(`Order ${orderId} updated paid = true, staus: delivered`)

    } catch (error) {
        return NextResponse.json({error:"Error in updating order"},{status:500});
    }
}