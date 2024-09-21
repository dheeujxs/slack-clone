'use client';

import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";



export default function Home() {
  const router = useRouter();
  const [open,setOpen] = useCreateWorkspaceModal()
  const {isLoading,data} = useGetWorkspaces();

  const workSpaceId = useMemo(() =>data?.[0]?._id,  [data])

  useEffect(() => {
    if(isLoading) return;

    if(workSpaceId){
     router.replace(`/workspace/${workSpaceId}`)
    } else if(!open){
      console.log("Open creation model")
      setOpen(true)
    }
  },[isLoading, workSpaceId , open,setOpen , router])
  return (
  <div>
    <UserButton />
  </div>
  );
}
