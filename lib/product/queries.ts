import { NextResponse } from "next/server"
import { prisma } from "../prisma-client"

export const getAllProducts =async () => {

    try {
        const allProduct = await prisma.product.findMany()

        if(!allProduct){
            return {status: 404, errors: "No products found"}
        }
        return {status: 200, data: allProduct}
    } catch (error) {
        return ({status:500,message:"fetching error"})
    }
}

export const getProductByName = async (q:string) =>{

   try {
     const product = await prisma.product.findMany({
        where:{
            name:{
                contains:q,
                mode: "insensitive",
            }
        }
    })
    if(!product || product.length === 0){
        return {status: 404, errors: "No products found"}
    }
    return {status: 200, data: product}
   } catch (error) {
    return ({status:500,message:"fetching error"})
   }
}

export const getProductById = async (id:string) => {    
    try {
        const result = await prisma.product.findUnique({
            where: {id}
        })
        if(!result){
            return {status: 404, errors: "Product not found"}
        } 
        return {status: 200, data: result}  
    } catch (error) {
        console.log(error);
        return ({status:500,message:"fetching error"})
    }
}

export const getProductsByPage = async ({skip,take}:{skip:number, take:number}) => {

try {
    const result = await prisma.product.findMany({
    skip:skip,
    take:take,
    orderBy:[{
        name: "asc"
    },{updatedAt: "desc"}]
})
if(!result){
    return {status: 404, errors: "No products found"}
}
return {status: 200, data: result}
} catch (error) {
    console.log(error);
    return ({status:500,message:"fetching error"}) 
}

}