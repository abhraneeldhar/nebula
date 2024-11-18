import { Note } from "./fileFormat";
export async function getOneNote(userId: string,noteId:string){
    const response=await fetch(process.env.NEXT_PUBLIC_URL+`/api/getOneNote?userId=${userId}&noteId=${noteId}`,{
        method: "GET"
    });
    const data= response.json() as any;
    // if (data.status==403){
    //     return(403)
    // }
    return (data);
}