import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Plese enter customer name"],
    },
    email:{
        type: String,
        required: [true,"Please enter customer email"],
    },
    city:{
        type: String,
        required: [true,"Plese enter customer city"],
    },
    postalCode:{
        type: String,
        required: [true,"Plese enter customer Postal code"],
    },
    streetAddress:{
        type: String,
        required: [true,"Plese enter customer Address"],
    },
    country:{
        type: String,
        required: [true,"Plese enter customer Country"],
    },
    paid:{
        type: Boolean,
       default: false,
    },
    cartProducts:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
        price: Number,
    }],
    updatedAt: {
        type:Date,
        default: Date.now,
    },
    status:{
        type:String,
        enum:[
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
            "payment failed",
        ],
        default:"Processing",
    },
    total:{ type: Number, required: true,},
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
},{timestamps: true,});

const Order = mongoose.models.Order || mongoose.model("Order",orderSchema);
export default Order;