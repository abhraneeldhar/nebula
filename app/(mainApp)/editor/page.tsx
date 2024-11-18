"use client"
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

export default function EditorPage() {
    const router = useRouter();
    useEffect(() => {
        router.push(`/editor/${uuidv4()}`)
    }, [])
    return (<></>)
}