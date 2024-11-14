import EditorComponent from "@/app/_components/editor/editorComponent";

export default function EditorPage({ params }: { params: { id: string } }){
    return(<>
    <EditorComponent id={params.id}/>
    </>)
}