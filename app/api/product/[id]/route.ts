import { deleteProduct, updateProduct } from "@/lib/product/mutation";
import { getProductById } from "@/lib/product/queries";
import { get, request } from "axios";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request:Request, {params}:{
    params: Promise<{id:string}>
}){
    const resolvedParams = await params;
    const {id} = resolvedParams;

    const res = await getProductById(id)

    if(res.errors){
        return NextResponse.json({
            errors: res.errors,
            status: res.status
        })
    }
    return NextResponse.json({
        data: res.data,
        status: res.status
    })
}


export async function PUT(request:Request, {params}: {
    params: Promise<{id:string}>
}){
    const role = request.headers.get("X-Role")
    const userId = request.headers.get("X-User-Id")

    if(!role || role !== "admin" || !userId){
        return NextResponse.json({errors: "Unauthorized"}, {status: 401})
    }

    const resolvedParams = await params;
    const {id} = resolvedParams;

    const body = await request.json()
    const res = await updateProduct({data: body, id});

    if(res.errors || res.success === false){
        return NextResponse.json({
            error: res.errors || res.message,
            status: res.status || 500
        })
    }
    return NextResponse.json({data: res.data, status: res.status})
}

export async function DELETE(
    request:Request,
    {params}: {
    params: Promise<{id:string}>
}){

 const userId = request.headers.get("X-User-Id")
 const role = request.headers.get("X-Role")

 if(!userId || !role || role !== "admin"){
     return NextResponse.json({errors: "Unauthorized"}, {status: 401})
 }
const resolvedParams = await params;
const {id} = resolvedParams;

const res = await deleteProduct(id)

if(res.errors){
    return NextResponse.json({
        errors: res.errors,
        status: res.status
    })
}
return NextResponse.json({data: res.data, status: res.status})
}