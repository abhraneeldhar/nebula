"use server"
import { createClient } from "@supabase/supabase-js";
import { getUserDetails } from "./getUserDetails";
import { mongoClientCS } from "./mongoConnector";
import { v4 as uuidv4 } from "uuid";


export async function setupNewAccount(userId: string) {
    const userDetails = await getUserDetails(userId);
    if (userDetails.newAccount == false) {
        return (null)
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const defaultNotes = db.collection("defaultNotes");
    const notesCollection=db.collection("notes");
    const usersCollection=db.collection("users")
    const defaultNotesArray = await defaultNotes.find({}).toArray();

    // Modify the array here
    const newDefaultNotes = defaultNotesArray.map(note => {
        const { _id, ...rest } = note;
        return {
            ...rest,
            id: uuidv4(),
            owner: userId,
            lastModifiedAt: Date.now()
        };
    });

    const result = await notesCollection.insertMany(newDefaultNotes);
    


    const { data: defaultProfilePics, error: e1 } = await supabase
        .storage
        .from('profilePics')
        .list('default')
    if (defaultProfilePics) {
        const newPicName = `profileImage${Date.now()}`
        const randomPfp = defaultProfilePics[Math.floor(Math.random() * defaultProfilePics.length)]

        const { data:copyData, error: e2 } = await supabase
            .storage
            .from('profilePics')
            .copy(`default/${randomPfp.name}`, `${userId}/${newPicName}`)

        console.log(copyData)

        const { data: publicUrl } = supabase
            .storage
            .from('profilePics')
            .getPublicUrl(`${userId}/${newPicName}`)


        console.log("new pic url>>>>> ", publicUrl)

        await usersCollection.updateOne({userId:userId},{$set:{imageUrl:publicUrl.publicUrl}})

    }

    await usersCollection.updateOne({userId:userId},{$set:{newAccount:false}})

}