import {useQuery} from "convex/react"

import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetWorkspaces = (p: { id: Id<"workspaces">; }) => {
    const data = useQuery(api.workspaces.get);
    const isLoading = data  === undefined;

    return {isLoading , data};
}

