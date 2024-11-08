import Bedrock from "./bedrock";
import Sidebar from "./sidebar";
import './fullscreen.css'

import { NextUIProvider } from "@nextui-org/react"


export default function Fullscreen() {
    return (<>
        <Sidebar />
        <Bedrock />
    </>)
}