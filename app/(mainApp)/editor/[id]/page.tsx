import EditorComponent from "@/app/_components/editor/editorComponent";

export default async function EditorPage({ params }: { params: { id: string } }){
    const { id } = await params
    
    return(<>
    <EditorComponent id={id}/>
    </>)
}