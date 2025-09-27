"use server"

import { createCartItem } from "@/lib/cart/mutation";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { success } from "zod";

export async function addToCart({userId,data}: {
    userId: string;
    data: { productId: string; quantity: number };
}) {
try {
    
    const session = await getSession();
    if (!session || session.userId !== userId) {
        throw new Error("Unauthorized");
    }
  
  
    const res = await createCartItem({userId, body: data});
    if(res && !res.errors){
        revalidatePath("/")
        return res.data;
        
    }
    return null;
} catch (error) {
    return {
        success: false,
        message: (error as Error).message || "Something went wrong",
    }
}
}