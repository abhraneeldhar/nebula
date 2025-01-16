"use server"
import { mongoClientCS } from "./mongoConnector";
import { supabase } from "./supabase/client"

export async function defaultPfpUpdate(pfpName: string, userId: string) {
    const newImageName = pfpName;
    await mongoClientCS.connect();
    const db = mongoClientCS.db("notesApp");
    const users = db.collection("users");

    const { data: defaultPics, error } = await supabase
        .storage
        .from('profilePics')
        .list('default', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        })
    if (defaultPics) {
        const randomPfp = defaultPics[Math.floor(Math.random() * defaultPics.length)]
        console.log(randomPfp)

        const { data, error } = await supabase
            .storage
            .from('profilePics')
            .copy(`default/${randomPfp.name}`, `${userId}/${newImageName}`);


        const { data:publicUrl } = supabase
            .storage
            .from('profilePics')
            .getPublicUrl(`${userId}/${newImageName}`)

        const res = await users.updateOne({ userId: userId }, [{ $set: { imageUrl: publicUrl } }]);
        return(res)
    }
}