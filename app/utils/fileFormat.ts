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

export interface Folder{
    owner:string,
    id:number,
    title:string,
    type:"Folder",
    createdAt:number,
    lastModifiedAt:number
    notesInside: Note[]
}

export interface FolderStructure{
    owner:string,
    rootNotes:Note[],
    folders:Folder[]
    lastModified:number,
}

