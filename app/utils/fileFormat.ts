import { Delta } from "quill/core"

export interface userType{
    userId: string,
    name: string,
    email: string,
    imageUrl: string,
    dateOfJoining: number
}

export interface Note{
    owner:string,
    // id:number,
    id: string,
    type: "Note",
    // snippet:string,
    parent:{
        folderId:string|null,
        folderName:string
    },
    title:string,
    content:Delta;
    // content:JSON,
    createdAt:number,
    lastModifiedAt:number
}
export interface DisplayNote{
    owner:string,
    // id:number,
    id: string,
    type: "Note",
    // snippet:string,
    parent:{
        folderId:string|null,
        folderName:string
    },
    title:string,
    createdAt:number,
    lastModifiedAt:number
}


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

