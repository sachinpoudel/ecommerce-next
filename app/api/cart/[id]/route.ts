import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { updateCartItem,deleteCartItem } from "@/lib/cart/mutation";

export async function PUT (req:NextRequest, params:Promise<{id:string}>){
    

    const userId = req.headers.get("X-User-Id");
    const role = req.headers.get("X-Role");
    
    if(!userId || role !== "USER"){
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }
    const {id} = await params;

    const body = await req.json();
    if(!body){
        return NextResponse.json({message: "Invalid request body"}, {status: 400});
    }   

    const response = await updateCartItem(id, userId, body);

    if(response.errors){
        return NextResponse.json({message: response.errors}, {status: response.status});
    }
    return NextResponse.json({data: response.data}, {status: response.status});
}

export async function DELETE(req:NextRequest, params:Promise<{id:string}>){

    const {id} = await params;

    const response = await deleteCartItem(id);

    if(response.errors){
        return NextResponse.json({message: response.errors}, {status: response.status});
    }
    return NextResponse.json({data: response.data}, {status: response.status}); 
}