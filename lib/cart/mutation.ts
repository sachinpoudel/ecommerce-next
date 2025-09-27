import { Prisma } from "@prisma/client";
import { prisma } from "../prisma-client";
import { cartSchema } from "../zodSchema";

export async function createCartItem({userId, body}:{userId:string, body:{ productId:string, quantity:number }}){

    const { productId, quantity } = body;
    const validationResult = cartSchema.safeParse(body);
    if (!validationResult.success) {
    const messages = validationResult.error.issues.reduce((acc, err) => {
      acc[err.path[0] as string] = err.message;
      return acc;
    }, {} as Record<string, string>);
    return {
      status: 400,
      errors: messages,
    };
  }

  const item = await prisma.product.findUnique({
    where:{
        id: body.productId
    }
  })
if(!item){
    return {status: 404, errors: "Product Not Found"}
}
const existingCartItem = await prisma.cartItems.findFirst({
    where:{
        userId,
        productId
    }
})

if(existingCartItem){
    const updatedItem = await prisma.cartItems.update({
        where:{
            id: existingCartItem.id
        },
        data:{
            quantity: existingCartItem.quantity + quantity
        }
    })
    return {status: 200, data: updatedItem}
}
const newCartItem = await prisma.cartItems.create({
    data:{
        userId,
        productId,
        quantity
    }
})
if(!newCartItem){
    return {status: 500, errors: "Failed to add item to cart"}  
}
return {status: 200, data: newCartItem}
}

export async function deleteCartItem(id:string){
    const existingCartItem = await prisma.cartItems.findFirst({
        where:{
            id
        }
    })
    if(!existingCartItem){
        return {status: 404, errors: "Cart Item Not Found"}
    }
    const deletedItem = await prisma.cartItems.delete({
        where:{
            id
        }
    })
    if(!deletedItem){
        return {status: 500, errors: "Failed to delete cart item"}
    }
    return {status: 200, data: deletedItem}
}

export async function updateCartItem(id:string,userId:string, data:{ productId:string, quantity:number }){

    const validationResult = cartSchema.safeParse(data);
    if (!validationResult.success) {
    const messages = validationResult.error.issues.reduce((acc, err) => {
      acc[err.path[0] as string] = err.message;
      return acc;
    }, {} as Record<string, string>);
    return {
      status: 400,
      errors: messages,
    };
  }
  const existingCartItem = await prisma.cartItems.findFirst({
    where:{
        productId: data.productId,
        userId,
        id,
    }
  })
    if(!existingCartItem){
        return {status: 404, errors: "Cart Item Not Found"}
    }
    const updatedItem = await prisma.cartItems.update({
        where:{
            id: existingCartItem.id
        },
        data:{
            quantity: data.quantity
        }
    })
    if(!updatedItem){
        return {status: 500, errors: "Failed to update cart item"}
    }
    return {status: 200, data: updatedItem}
}

export async function deleteAllCartItems(userId:string){
    const deletedItems = await prisma.cartItems.deleteMany({
        where:{
            userId
        }
    })
    if(!deletedItems){
        return {status: 500, errors: "Failed to delete cart items"}
    }
    return {status: 200, data: deletedItems, message: "All cart items deleted"};
}