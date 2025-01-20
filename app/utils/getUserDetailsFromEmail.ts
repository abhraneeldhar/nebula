"use server"
import { userType } from "./fileFormat";
import { mongoClientCS } from "./mongoConnector";

export const getUserDetailsFromEmail = async (email: string) => {
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const usersCollection = db.collection("users");
    const userDetailsJson = await usersCollection.findOne({ email:email });
    const userDetails: userType = {
        _id: String(userDetailsJson?._id),
        userId: userDetailsJson?.userId,
        name: userDetailsJson?.name,
        userName: userDetailsJson?.userName,
        email: userDetailsJson?.email,
        imageUrl: userDetailsJson?.imageUrl,
        bio: userDetailsJson?.bio,
        dateOfJoining: userDetailsJson?.dateOfJoining,
        friendList: userDetailsJson?.friendList,
        newAccount: userDetailsJson?.newAccount
    }
    return (userDetails)
}