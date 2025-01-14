export async function GET(req,res){
    try{
        return new Response(
            JSON.stringify({ message: 'Hello' }),
            { status: 200 }
          );
    }catch(e){
        return new Response(
            JSON.stringify({ message: 'Internal Server Error' }),
            { status: 500 }
          );
    }
}