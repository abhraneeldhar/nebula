export interface Note{
    owner:string,
    id:number,
    type: "Note",
    title:string,
    content:string,
    // content:JSON,
    createdAt:number,
    lastModifiedAt:number
}
export interface CollectionOfNotes{notes:Note[]}

export interface Folder{
    owner:string,
    id:number,
    title:string,
    type:"Folder",
    createdAt:number,
    lastModifiedAt:number,
    notesInsideIds: number[]
}

export interface FolderStructure{
    owner:string,
    // rootNotes:Note[],
    rootNoteIds:number[],
    folders:Folder[]
    lastModified:number,
}

