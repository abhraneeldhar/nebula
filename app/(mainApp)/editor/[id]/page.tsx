import EditorComponent from "@/app/_components/editor/editorComponent";
import { getOneNote } from "@/app/utils/getOneNote";
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail";
// import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";


export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    const session = await getServerSession(options);
    const userDetails = await getUserDetailsFromEmail(session?.user.email as string);
    const openNoteData = await getOneNote(userDetails.userId as string, id);


    return (<>

        <EditorComponent id={id} openNoteData={openNoteData} />
    </>)
}

