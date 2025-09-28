import { createProduct } from "@/lib/product/mutation";
import { getAllProducts, getProductByName } from "@/lib/product/queries";
import { error } from "console";
import { NextResponse } from "next/server";
export async function GET(request: Request) { ///sabai product queries anusar fetch garx

    const url = new URL(request.url) //req.url = full url path like http://localhost:3000/api/product?q=apple
    //and new URL constructor le full url path linxa ani tyo url object ma convert garxa
    //url object ma searchParams property hunxa jun le url ko query parameters haru access garna dinxa
    //searchParams property le URLSearchParams object return garxa jun le query parameters haru handle garna madat garxa
    //searchParams.get("q") le "q" vanne query parameter ko value return garxa
    //eg: http://localhost:3000/api/product?q=apple  => searchParams.get("q") le "apple" return garxa
    //eg: http://localhost:3000/api/product  => searchParams.get("q") le null return garxa  
    const searchTerm = url.searchParams.get("q")


let res;
if(searchTerm){ //ani search term anusar product fetch garx
    res = await getProductByName(searchTerm)
}else{
    res = await getAllProducts()
}
if(res.errors){
    return NextResponse.json({message: "Internal server error"}, {status: 500})     
    
}
return NextResponse.json({data:res.data}, {status: res.status})

}


export async function POST(req:Request){


    const role = req.headers.get("X-Role")
    const userId = req.headers.get("X-User-Id")

    if(!role || role !== "admin" || !userId){
        return NextResponse.json({errors: "Unauthorized"}, {status: 401})
    }

    const body = await req.json()
    const res = await createProduct(body);

if(res.errors){
    return NextResponse.json({
        error: res.errors,
        status: res.status
    })
};  
return NextResponse.json({data: res.data, status: res.status})
}