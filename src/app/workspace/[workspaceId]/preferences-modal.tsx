
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose


  } from "@/components/ui/dialog"
  import {toast} from 'sonner'
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdaateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
  


  interface PreferencesModalProps{
    open:boolean;
    setOpen:(open:boolean) => void;
    initalValue: string
  }






export const PreferencesModal = ({
    open,
    setOpen,
    initalValue,

}: PreferencesModalProps) =>{
    const workspaceId = useWorkspaceId()
    const [value , setValue] = useState(initalValue)
    const router = useRouter();
    const [ConfirmDialog , confirm] = useConfirm(
        "Are you sure?",
        "This action is  irreversible"
    );
 
    const [editOpen , setEditOpen] = useState(false)

    const { mutate: UpdateWorkspace , isPending: isUpdatingWorkspace} = useUpdaateWorkspace()
    const { mutate: removeWrokspace , isPending: isRemovingWorkspace} = useRemoveWorkspace()
   
   const handleRemove = async () => {
const ok = await confirm();

if(!ok) return;
    removeWrokspace({
        id: workspaceId
    } , {
        onSucces: () => {
            // router.replace("/")
            toast.success("Workspace removed")
          
        } ,
        onError:() => {
            toast.error("Failed to remove workspace")
        }

    })
   }
   
   
   
    const handleEdit  =  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        UpdateWorkspace({
            id: workspaceId,
            name:value,
        } , {
            onSucces: () => {
                toast.success("Workspace updated")
                setEditOpen(false)

              
            } ,
            onError:() => {
                toast.error("Failed to update workspace")
            }

        })
    }
    
    
    return (
        <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
                <DialogTitle>
                    {value}
                </DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">
                                    Workspace name
                        </p>
                        <p  className="text-sm text-[#1264a3] hover:underline  font-semibold">
                            Edit 
                        </p>

                    </div>
                    <p className="text-sm">
                        {value}
                    </p>

                </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Rename this workspace
                        </DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleEdit}> 
                        <Input
                        value={value}
                        disabled={isUpdatingWorkspace}
                        onChange={(e) => setValue(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                            placeholder="Workspace name e.g. 'Work' , 'Personal','Home'"
                        
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                    <Button variant='outline' disabled={isUpdatingWorkspace}>
                                        Cancel
                                    </Button>
                            </DialogClose>
                            <Button disabled={isUpdatingWorkspace}>Save</Button>
                        </DialogFooter>

                    </form>
                </DialogContent>
                </Dialog>
               

           
                <Button disabled={false} onClick={handleRemove} className="flex items-center gap-x-2 px-5 py-4 bg-white  rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600">
                  <TrashIcon  className="size-4"/>
                  <p className="text-sm font-semibold">Delete workspace</p>     

                </Button>

            </div>
        </DialogContent>
        </Dialog>
        </>
    )
}