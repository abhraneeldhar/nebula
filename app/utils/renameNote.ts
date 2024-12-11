export async function renameNote(noteId:string,newName:string){
    const response = await fetch(process.env.NEXT_PUBLIC_URL+`/api/renameNote?noteId=${noteId}&newName=${newName}`, {
        method: 'PATCH'
    });
    console.log(response)
}
