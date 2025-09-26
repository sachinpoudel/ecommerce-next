import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const encrypt = async (payload: JWTPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
};


export const decrypt = async (session?: string) => {
    if(!session) return null;
    try {
         const {payload } = await jwtVerify(session, encodedKey);
         return payload;
    } catch (error) {
        return null;
    }
}

export const createSession = async ({
  id,
  role,
}: {
  id: string;
  role: string;
}) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  const session = await encrypt({
    id,
    expiresAt,
    role,
  });
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: session,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return session;
};

export const getSession = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if(!session){
        return null;
    }
    return decrypt(session);
};

export const removesession = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("session");
};
