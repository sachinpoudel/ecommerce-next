import { prisma } from "../prisma-client";
import { backendProductSchema } from "../zodSchema";

export const createProduct = async (data:any) => {

    const { name, description, price, stock, category, status, image } = data;

const validateData = backendProductSchema.safeParse(data);

if(!validateData.success){
    const msg = validateData.error.issues.map(issue => issue.message).join(", ");
    return {
        success: false,
        message: msg || "Invalid data"
    } 
}
    const newProduct = await prisma.product.create({
        data:{
            name,
            description,
            price,
            categoryId: parseInt(category),
            stock,
            //            status,
            imageUrl: image || null,

        }
    })
    if(!newProduct){
        return {status: 500, message: "Failed to create product"}
    }
    return {status: 200, data: newProduct}
}

export const updateProduct = async ({data,id}: {data:any, id:string}) => {

    const { name, description, price, stock, category, status, image } = data;
    const validateData = backendProductSchema.safeParse(data);

    if(!validateData.success){
        const msg = validateData.error.issues.map(issue => issue.message).join(", ");
        return {
            success: false,
            message: msg || "Invalid data"
        } 
    }
try {
    
    const updateProduct = await prisma.product.update({
        where: {id},
        data:{
            name,
            description,
            price,
            stock,
            imageUrl: image || null,
            categoryId: parseInt(category),
        //    status
        }
    })
    if(!updateProduct){
        return {status: 500, message: "Failed to update product"}
    }
    return {status: 200, data: updateProduct}
} catch (error) {
    return {status: 500, message: "Internal server error"}
}
}

export const deleteProduct = async (id:string) => {


try {
    const deleteProduct = await prisma.product.delete({
        where: {id}
    })
    if(!deleteProduct){
        return {status: 500, message: "Failed to delete product"}
    }
    return {status: 200, data: deleteProduct}   
} catch (error) {
    return {status: 500, message: "Internal server error"}
}
}
    

