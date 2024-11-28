"use server"
import { userDetailsType } from "../setupAccount/page"
import { mongoClientCS } from "./mongoConnector"

export async function updateUserDetails(userDetails:userDetailsType, usernameState : String, imgUrl : string){
    await mongoClientCS.connect();
    const db=mongoClientCS.db("notesApp");
    const users=db.collection("users");
    const res =await users.updateOne({userId: userDetails.userId},[{$set:{name:userDetails.name,userName:usernameState,imageUrl:imgUrl}}]);
    return(res)
}
