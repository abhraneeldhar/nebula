"use server"

import { userDetailsType } from "@/app/setupAccount/page";
import { getUserDetails } from "../getUserDetails";
import { mongoClientCS } from "../mongoConnector"

export async function getFriends(selfUserId: string) {
    var friendDetailsArray: userDetailsType[];
    friendDetailsArray = [];
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const users = db.collection("users");
    const friendList = await users.findOne({ userId: selfUserId }, { projection: { friendList: 1, _id: 0 } })

    if (friendList) {
        for (const friendId of friendList.friendList) {
            var fetchedDetails = await getUserDetails(friendId);
            friendDetailsArray.push(fetchedDetails);
        }
        return (friendDetailsArray)
    }

    else {
        return ([])
    }
}