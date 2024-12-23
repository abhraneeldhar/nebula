import EditorComponent from "@/app/_components/editor/editorComponent";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }){
   
    const id = (await params).id
    return(<>
    <EditorComponent id={id}/>
    </>)
}

// import { GetStaticProps } from 'next';

// export default async function EditorPage({ params }: { params: { id: string } }) {
//   let id: string;

//   if (typeof params.id === 'string') {
//     id = params.id;
//   } else {
//     // Handle the case where params.id is a Promise
//     try {
//       id = await params.id;
//     } catch (error) {
//       console.error('Error fetching ID:', error);
//       // You might want to handle this error differently in a production app
//       return null; // or render an error message
//     }
//   }

//   return (
//     <EditorComponent id={id} />
//   );
// }