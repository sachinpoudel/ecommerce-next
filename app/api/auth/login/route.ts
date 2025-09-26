import { createSession } from "@/lib/session";
import { userLoginSchema } from "@/lib/zodSchema";
import { FormLoginValues } from "@/components/forms/LoginForm";
import { prisma } from "@/lib/prisma-client";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body: FormLoginValues = await req.json();
        const { email, password } = body;

        const validateData = userLoginSchema.safeParse(body);
        if (!validateData.success) {
            const msg = validateData.error.issues.map((issue) => issue.message).join(", ");
            return new Response(JSON.stringify({ error: msg }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const matchPass = await bcrypt.compare(password, user.passwordHash);
        if (!matchPass) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { 
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const token = await createSession({ 
            id: user.id.toString(), 
            role: "user" 
        });

        return new Response(JSON.stringify({ 
            token,
           data:{user: {
                id: user.id,
                name: user.name,
                email: user.email
            }} ,
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Login error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}