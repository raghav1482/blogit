import {Schema,model,models} from 'mongoose'

const commentSchema = new Schema({
    post:{
        type:Schema.Types.ObjectId,
        ref:'Prompt',
    },
    comment:{
        type:String,
        required:[true,'comment is required'],
    },
    userid:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
})

const CommentDat = models.CommentDat || model("CommentDat",commentSchema);

export default CommentDat;