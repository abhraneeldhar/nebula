import EditorComponent from "@/app/_components/editor/editorComponent";
import { getOneNote } from "@/app/utils/getOneNote";
import { getUserDetailsFromEmail } from "@/app/utils/getUserDetailsFromEmail";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";


export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    return (<>

        <EditorComponent id={id}/>
    </>)
}

