import EditorComponent from "@/app/_components/editor/editorComponent";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {

    const id = (await params).id
    return (<>
        <EditorComponent id={id} />
    </>)
}

