import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"please enter your name"]
    },
    email:{
        type: String,
        required: [true,"please enter your Email"],
        unique: true,
    },
    password:{
        type: String,
    },
    admin:{
        type: Boolean,
        default: false,
    },
    profileImage:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2022/10/02/01/58/technology-7492577_640.jpg",
    },
    wishlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    notificationPreferences:{
        orderUpdates:{
            type: Boolean,
            default: true,
        },
        promotions:{
            type:Boolean,
            default: false,
        },
    },
    review:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],

});

const User = mongoose.models.User || mongoose.model("User",userSchema);
export default User;