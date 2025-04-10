import dbConnect from "@/utils/config/dbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/utils/models/Order";
import Review from "@/utils/models/Review";

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ canReview: false }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);

    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product id is not found or invalid product id" },
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Product id is not found or invalid product id" },
        { status: 404 }
      );
    }
    const objectIdProductId = new mongoose.Types.ObjectId(productId);
    const hasPurchased = await Order.findOne({
      user: session.user._id,
      "cartProducts.product": objectIdProductId,
      status: "delivered",
      paid: true,
    });

    if (!hasPurchased) {
      return NextResponse.json({ canReview: false }, { status: 200 });
    }

    const hasReviewed = await Review.findOne({
      user: session.user._id,
      product: objectIdProductId,
    });
    return NextResponse.json({ canReview: !hasReviewed }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error in geting review" },
      { status: 404 }
    );
  }
}
