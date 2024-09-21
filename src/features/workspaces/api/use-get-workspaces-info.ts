import {useQuery} from "convex/react"

import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetWokspaceProps {
    id: Id<"workspaces">
}

export const useGetWorkspaceInfo = ({id}: useGetWokspaceProps) => {
    const data = useQuery(api.workspaces.getInfoById , {id});
    const isLoading = data  === undefined;

    return {isLoading , data};
}

