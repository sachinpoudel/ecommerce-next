import { prisma } from "../prisma-client";
import { userRegisterSchema } from "../zodSchema";
import bcrypt from "bcryptjs";
import { FormRegistrationValues } from "@/components/forms/RegisterForm";

export const createUser =  async(data:FormRegistrationValues) => {
    const{name, email, password} = data;

    const valData = userRegisterSchema.safeParse(data);
    if(!valData.success){
        const msg = valData.error.issues.map((issue) => issue.message).join(", ");
        return {error: msg, status:400};
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where:{email}
        })
        if(existingUser){
            return {errror: "User already exists", status:400};
        }
        const hashedPass = await bcrypt.hash(password,10)
        const newUser = await prisma.user.create({
            data: {
                name,email,passwordHash: hashedPass
            }, 
            select:{
                id:true,
                name:true,
                email:true,
               
            }
        })
        if(!newUser){
            return {error: "Failed to create user", status:500};
        }
        return {user: newUser, status:201};
    } catch (error) {
        return {error: "Internal server error", status:500};
    }
}