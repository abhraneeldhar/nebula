import EditorComponent from "@/app/_components/editor/editorComponent";

export default async function EditorPage({ params }: { params: { id: string } }){
    const id = params.id
    
    return(<>
    <EditorComponent id={id}/>
    </>)
}