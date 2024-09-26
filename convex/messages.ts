import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const populateMember = (ctx:QueryCtx , memberId : Id<"members">) => {
    return ctx.db.get(memberId)
}

const populateUser = (ctx: QueryCtx ,  userId: Id<"users">) => {
    return ctx.db.get(userId)
}

const populateReactions = (ctx: QueryCtx , messageId: Id<"messages">) => {
    return ctx.db
    .query("reactions")
}

const getMember = async(ctx: QueryCtx   ,  workspaceId: Id<"workspaces"> , userId: Id<"users">) => {
    return ctx.db
    .query("members")
    .withIndex("by_workspace_of_user_id" , (q) => 
    q.eq("workspaceId"  , workspaceId).eq("userId" , userId)
    )
    .unique();
} 

export const create = mutation({
    args:{
        body: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
       conversationId: v.optional(v.id("conversations")),
        parentMeassageId: v.optional(v.id("messages"))
    },
    handler: async(ctx ,args) => {
        const userId =await auth.getUserId(ctx);

        if(!userId){
            throw new  Error("Unauthorized");
        }
        const member = await getMember(ctx , args.workspaceId , userId)

        if(!member){
            throw new Error("Unauthorized")
        }
        let _conversationId = args.conversationId;

        if(!args.conversationId && !args.channelId && args.parentMeassageId){
            const  parentMessage = await ctx.db.get(args.parentMeassageId)

            if(!parentMessage){
                throw new Error("Parent message not found")
            }
            _conversationId = parentMessage.conversationId;
        }

        const messgaeId= await ctx.db.insert("messages" , {
            memberId: member._id,
            body: args.body,
            image: args.image,
            conversationId: _conversationId,
            channnelId:  args.channelId,
            workspaceId:  args.workspaceId,
            parentMessageId: args.parentMeassageId,
            updatedAt: Date.now()
        })
            return messgaeId;

    },

})