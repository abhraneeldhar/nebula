export async function getDisplayNotes(userId: string){
    const response= await fetch(process.env.NEXT_PUBLIC_URL+`/api/getDisplayNotes?userid=${userId}`,{
        method: "GET"
    });
    const data=response.json();
    return(data)
}