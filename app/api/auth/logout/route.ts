export const POST = async (request: Request) => {
 return Response.redirect("/api/auth/signout?callbackUrl=/", 302);
}