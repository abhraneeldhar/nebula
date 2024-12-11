export async function deleteNote(noteId:string){
    try{
        const response = await fetch(process.env.NEXT_PUBLIC_URL+`/api/deleteNote?noteId=${noteId}`,{
            method: "DELETE"
        });
        console.log(response)
        return(response.json())
    }
    catch(error){
        console.log(error)
        return (error)
    }
}