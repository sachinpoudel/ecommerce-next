import { createSession } from "@/lib/session";
import { prisma } from "@/lib/prisma-client";
import bcrypt from "bcryptjs";
import { userRegisterSchema } from "@/lib/zodSchema";
import { FormRegistrationValues } from "@/components/forms/RegisterForm";

export async function POST(request: Request) {
   try {
       const body: FormRegistrationValues = await request.json();
       const { name, email, password } = body;

       const valData = userRegisterSchema.safeParse(body);
       if (!valData.success) {
           const msg = valData.error.issues.map((issue) => issue.message).join(", ");
           return new Response(JSON.stringify({ error: msg }), { 
               status: 400,
               headers: { 'Content-Type': 'application/json' }
           });
       }

       const existingUser = await prisma.user.findUnique({
           where: { email }
       });
       
       if (existingUser) {
           return new Response(JSON.stringify({ error: "User already exists" }), { 
               status: 400,
               headers: { 'Content-Type': 'application/json' }
           });
       }

       const hashedPass = await bcrypt.hash(password, 10);

       const newUser = await prisma.user.create({
           data: {
               name,
               email,
               passwordHash: hashedPass
           },
           select: {
               id: true,
               name: true,
               email: true,
           }
       });

       const session = await createSession({ id: newUser.id, role: "user" });

       return new Response(JSON.stringify({ data: { user: newUser }, token: session }), {
           status: 201,
           headers: { 'Content-Type': 'application/json' }
       });

   } catch (error) {
       console.error("Registration error:", error);
       return new Response(JSON.stringify({ error: "Internal server error" }), { 
           status: 500,
           headers: { 'Content-Type': 'application/json' }
       });
   }
}