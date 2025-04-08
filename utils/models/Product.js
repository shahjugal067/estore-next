import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter product name"],      
    },
    description: {
        type: String,      
    },
   images: [
    { type: String,}
   ],
   price:{
    type: Number,
   },
   originalPrice:{
    type: Number,
   },
   brand:{type:String},
   material:{type: String},
   bracelet:{type: String},
   condition:{type: String},
   user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
   },
   reviews:[
    { type: mongoose.Schema.Types.ObjectId,
        ref:"Review",
    },
   ],
   avarageRating:{
    type: Number,
    default: 0,
   },
   numReviews:{
    type: Number,
    default: 0,
   },
   featured:{
    type: Boolean,
    default: false,
   },
   category:{ type: String},
   movement:{ type: String,
    enum:[
        "automatic",
        "quartz",
        "manual",
        "kinetic",
        "solar",
        "battery",
        "mechanical",
    ],
    default:"automatic",
   },
   thickness:{
    type: String,
    default:"",
   },
   glass:{
    type:String,
   },
   luminova:{
    type:String,

   },
   casematerial:{
    type:String,
    enum:[
        "stainless steel",
        "gold",
        "silver",
        "titanium",
        "ceramic",
        "plastic",
        "carbon fiber",
    ],
    default:"stainless steel",
   },
   crown:{
    type: String,
    default:""
   },
   bandsize:{
    type: String,
    default:"",
   },
   water:{
    type: String,
    default:"30m",
   },

},
{timestamps: true,});

productSchema.methods.hasUserPurchased = async function(userId){
    const Order = mongoose.model("Order");
    const order = await Order.findOne({
        user: userId,
        cartProducts: this._id,
        status: "delivered",
        paid: true,
    });
    return !!order;
};

const Product = mongoose.models.Product || mongoose.model("Product",productSchema);
export default Product;