import {getSession} from "@/lib/session";

export async function GET (){
    try {
        const session = await getSession();
        if(!session){
           return new Response(JSON.stringify({error: "Not authenticated"}), {
            status: 401,
            headers: {'Content-Type': 'application/json'}
           });
        }
        return new Response (JSON.stringify({data: session}), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });     
    } catch (error) {
        return new Response(JSON.stringify({error: "Internal server error"}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
           });
    }
}