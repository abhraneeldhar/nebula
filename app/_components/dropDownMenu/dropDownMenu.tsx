import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import styles from "./ddm.module.css"
export function DropdownMenuDemo({noteId}:{noteId: string}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={styles.dropDownMenuTrigger} onClick={(e)=>{
        e.stopPropagation();
        }}>
        <div>...</div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-30" onClick={(e)=>{
        e.stopPropagation();
        }}>
        <DropdownMenuGroup>

          <DropdownMenuItem onClick={()=>{
            console.log(noteId, " rename")}}>Rename</DropdownMenuItem>
          <DropdownMenuItem onClick={()=>{
            console.log(noteId, " share")}}>Share</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={styles.deleteBtn} onClick={()=>{
            console.log(noteId, " delete")}}>Delete</DropdownMenuItem>

        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
