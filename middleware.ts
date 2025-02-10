export {default} from "next-auth/middleware"
// import { type NextRequest } from 'next/server'
// import { updateSession } from "./app/utils/supabase/middleware"
// export async function middleware(request: NextRequest) {
//   return await updateSession(request)
// }
export const config={matcher: ["/home","/editor","/authtesting","/setupAccount","/friends","/settings"]}