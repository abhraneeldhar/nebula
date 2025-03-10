import { Delta } from "quill/core"
// import { userDetailsType } from "../setupAccount/page";
export interface userType{
    _id:string,
    userId: string,
    name: string,
    userName: string,
    email: string,
    imageUrl: string,
    bio:string,
    dateOfJoining: number
    friendList:string[],
    newAccount:boolean
}


export interface Note{
    _id?:string;
    owner:string,
    // id:number,
    id: string,
    type: "Note",
    snippet:string,
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
    snippet:string,
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

export interface requestType{
    id:string,
    senderId:string,
    receiverId:string,
    status:string,
    createdAt:number
}

export interface sharedNoteType{
    _id:string,
    id:string,
    senderId:string,
    receiverId:string,
    sharedAt:number,
    sharedNote:Note
}