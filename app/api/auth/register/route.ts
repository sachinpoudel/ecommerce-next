import { prisma } from "@/lib/prisma-client";
import bcrypt from "bcrypt";

export const POST = async (request:Request) => {

    const {email , name ,password} = await request.json();

    const finduser = await prisma.users.findUnique({
        where:{
            email:email
        }
    })
    
    if(finduser){
        return new Response(JSON.stringify({message:"User already exists"}),{status:400})
    }
const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
        data:{
            email,
            name,
            passwordHash
        }
    })

    return new Response(JSON.stringify(user),{status:201})
}