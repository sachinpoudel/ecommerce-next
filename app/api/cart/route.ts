import { prisma } from "@/lib/prisma-client";
import { getSession } from "@/lib/session";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { cartSchema } from "@/lib/zodSchema";
import { getCartByUserId } from "@/lib/cart/queries";
import {  createCartItem, deleteAllCartItems } from "@/lib/cart/mutation";

//cart by id
export async function GET(request: Request) {
  const userId = request.headers.get("X-User-Id");

  if (!userId) {
    return NextResponse.json(
      { errors: "User ID is required" },
      { status: 400 }
    );
  }

  const response = await getCartByUserId(userId);
  if (response.errors)
    return NextResponse.json(
      { errors: response.errors },
      { status: response.status }
    );

  return NextResponse.json(
    { data: response.data },
    { status: response.status }
  );
}

//create item in cart
export async function POST(req:NextRequest) {

    const userId = req.headers.get("X-User-Id");
    const role = req.headers.get("X-Role");

    if(!userId || role !== "USER"){
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const body = await req.json();  


    if (!body) {
        return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }


    const response = await createCartItem({userId, body});

    if (!response) {
        return NextResponse.json({ message: "Failed to add item to cart" }, { status: 500 });
    }
    return NextResponse.json({ data: response }, { status: 200 });
}

//delete item in cart
export async function DELETE(req:NextRequest){
     const userId = req.headers.get("X-User-Id");
    const role = req.headers.get("X-Role");

    if(!userId || role !== "USER"){
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }
   
    const response = await deleteAllCartItems(userId);
    
    if(response.errors){
        return NextResponse.json({message: response.errors}, {status: response.status});
    }       
    return NextResponse.json({message: response.message, data: response.data}, {status: response.status});
}