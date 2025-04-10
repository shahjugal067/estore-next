import dbConnect from "@/utils/config/dbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Order from "@/utils/models/Order";
import Review from "@/utils/models/Review";
import Product from "@/utils/models/Product";


export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({error:"Not authonticated"},{status:401});

        }
        const {productId, rating, comment } = await req.json();
        if(!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({error:"Invalid product id"},{status:404});
        }

        const objectIdProductId = new mongoose.Types.ObjectId(productId);
        const hasPurchased = await Order.findOne({
            user: session.user._id,
            "cartProducts.product": objectIdProductId,
            status: "delivered",
            paid: true,
        });
        if(!hasPurchased) {
            return NextResponse.json({canReview:false},{status:200})
        }

        const existingReview = await Review.findOne({
            user: session.user._id,
            product: objectIdProductId,
        });
        if(existingReview) {
            return NextResponse.json({error:"You have already reviewed this product"},{status:400});
        }
        const newReview  = new Review({
            user: session.user._id,
            product: objectIdProductId,
            rating,
            comment,
        });
        await newReview.save();

        const product = await Product.findById(objectIdProductId);

        if(!product) {
            return NextResponse.json({error:"Product not found"},{status:404});
        }

        product.reviews.push(newReview._id);

        product.numReviews = product.reviews.length;

        const allReviews = await Review.find({product: objectIdProductId});

        const avgRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

        product.avgRating = avgRating;

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        await product.save();

        return NextResponse.json({message:"Review submitted successfully"},{status:200});

    } catch (error) {
      return NextResponse.json({error:"Internal server error in reviews"},{status:500});
        
    }
};

export async function PUT(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({error:"Not authonticated"},{status:401});
        }
        const {reviewId,rating,comment } = await req.json();

        const review = await Review.findOne({
            id: reviewId,
            user: session.user._id,
        });

        if(!review) {
            return NextResponse.json({error:"Failed to find review"},{status:404});
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        const product = await Product.findById(review.product);
        const allReviews = await Review.find({product: review.product});
        const avgRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
        product.avgRating = avgRating;

        await product.save();
        
            return NextResponse.json({message:"Review updated successfully"},{status:200});
        
    } catch (error) {
        return NextResponse.json({error:"Internal server error in reviews"},{status:500});

    }
};

export async function GET(req) {
    try {
        await dbConnect();

        const {searchParams } = new URL(req.url)
        const productId = searchParams.get('productId');
        const page = parseInt(searchParams.get('page') || 1);
        const limit = parseInt(searchParams.get('limit') || 5);

       if(!productId) {
        return NextResponse.json({error:"Product is is not found"},{status:404});
       }

        const skip = (page -1) * limit;
        const reviews = await Review.find({product:productId}).populate("user","name profileImage").sort({createdAt:-1}).skip(skip).limit(limit);
        const total = await Review.countDocuments({product:productId});

        const hasMore = total > skip + reviews.length;

        return NextResponse.json({reviews,hasMore,total});

    } catch (error) {
        return NextResponse.json({ error:"Internal error or geting review error"},{status:500})
    }
};

export async function DELETE(req) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if(!session) {
            return NextResponse.json({canReview:false},{status:200});

        }

        const {reviewId} = await req.json();
        const review = await Review.findOne({
            _id: reviewId,
            user: session.user._id,
        });
        if(!review) {
            return NextResponse.json({error:"Failed to get reviewed"},{status:400});

        }
        const productId = review.product;
        await Review.deleteOne({_id:reviewId});
        const product = await Product.findById(productId);
        const reviews = product.review.filter((r)=> r.toString() !== reviewId);

        product.numReviews = product.review.length;
        if(product.numReviews > 0){
            const allReviews = await Review.find({product: productId});
            const avgRating = allReviews.reduce((acc,item)=> acc + item.rating,0) / allReviews.length;
            product.avgRating = avgRating;
            
        }else{
            product.avgRating = 0
        }
        await product.save();

        return NextResponse.json({message:"Review deleted successfully"},{status:200})
    } catch (error) {
        return NextResponse.json({ error:"Internal error or geting review error"},{status:500})

    }
}
