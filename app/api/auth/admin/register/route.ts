import { prisma } from "@/lib/prisma-client";
import bcrypt from "bcrypt";

export const POST = async (request:Request) => {

    const {email ,username, name ,password} = await request.json();

    const findadmin = await prisma.users.findUnique({
        where:{
            username:username
        }
    })

    if(findadmin){
        return new Response(JSON.stringify({message:"Admin already exists"}),{status:400})
    }
const passwordHash = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
        data:{
            email,
            name,
            passwordHash,
            username,
            role:"admin"
        },
        select:{ email, name, username, role: true}    
    })

    return new Response(JSON.stringify(admin),{status:201})
}