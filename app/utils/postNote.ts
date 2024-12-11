import { Note } from "./fileFormat";
export async function postNote(newNote: Note){
    const response = await fetch(process.env.NEXT_PUBLIC_URL+`/api/postNote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newNote),
    });
    console.log(response)
}
