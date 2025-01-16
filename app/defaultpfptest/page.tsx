"use server"
import { Button } from "@radix-ui/themes";
import { supabase } from "../utils/supabase/client";
import { defaultPfpUpdate } from "../utils/defaultPfpUpdate";
export default function Defaultpfp() {
    const setpfp = async () => {
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
                .copy(`default/${randomPfp.name}`, 'private/avatar2.png')

        }
    }
    return (<>
        <Button onClick={() => { setpfp() }} >get pics</Button>
    </>)
}