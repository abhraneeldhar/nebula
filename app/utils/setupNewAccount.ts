"use server"
import { createClient } from "@supabase/supabase-js";
import { getUserDetails } from "./getUserDetails";
import { mongoClientCS } from "./mongoConnector";
import { v4 as uuidv4 } from "uuid";


export async function setupNewAccount(userId: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const userDetails = await getUserDetails(userId);
    if (userDetails.newAccount == false) {
        return (null)
    }

    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const defaultNotes = db.collection("defaultNotes");
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

    console.log(newDefaultNotes);

    const { data:defaultProfilePics, error } = await supabase
        .storage
        .from('profilePics')
        .list('default')

    console.log(defaultProfilePics)

}