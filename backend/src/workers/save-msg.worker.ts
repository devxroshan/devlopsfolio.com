import redisClient from '../config/redis.config'
import messageModel from '../models/message.model'
import app from '../config/app.config' 



export const SaveMessagegWorker = async () => {
    setInterval(async () => {
        const messages:string[] | null = await redisClient.lrange("messages", 0, -1)

        if(messages.length >= app.MAX_MESSAGE_SAVE && messages != null){            
            await Promise.all(messages.map(async (message, index) => {
                if(index > app.MAX_MESSAGE_SAVE - 1) return;

                const parsedMsg = JSON.parse(message)
                await messageModel.create({
                    sender: parsedMsg.sender,
                    recipient: parsedMsg.recipient,
                    content: parsedMsg.content,
                    is_seen: parsedMsg.is_seen,
                    is_pinned: parsedMsg.is_pinned,
                    replied_to: parsedMsg.replied_to,
                    createdAt: parsedMsg.createdAt
                })
                await redisClient.lrem("messages", 0, message);
                await redisClient.del(`msg:${parsedMsg?.id}`)
            }))
        }
    }, app.MESSAGE_SAVE_INTERVAL_SEC)
}