"use server"
import { userType } from "../fileFormat";
// import { userDetailsType } from "@/app/setupAccount/page";
import { mongoClientCS } from "../mongoConnector";
export async function updateFriendList(userId:string,newUserDetails:userType){
    await mongoClientCS.connect();
    const db=mongoClientCS.db("notesApp");
    const users=db.collection("users")
    const { _id, ...updatedFields } = newUserDetails;
    const res=await users.updateOne({userId:userId},{$set:updatedFields})
    return(res)
}