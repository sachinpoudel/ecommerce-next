import { prisma } from "../prisma-client";


export async function getAllCategories(){

    try {
        const result = await prisma.category.findMany({
            where:{
                deletedAt: null
            }
        })
        if(!result){
            return {status: 404, errors: "No categories found"}
        }
        return {status: 200, data: result}
    } catch (error) {
        return {status: 500, message: "Internal Server Error"}  
    }
}

export async function getAllCategoriesById(id: number){

    try {
        const result = await prisma.category.findMany({
            where:{
                
                id: id
            }
        })
        if(!result){
            return {status: 404, errors: "No categories found"}
        }
        return {status: 200, data: result}
    } catch (error) {
        return {status: 500, message: "Internal Server Error"}  
    }
}