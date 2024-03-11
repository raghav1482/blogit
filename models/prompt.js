import {Schema,model,models} from 'mongoose'

const promptSchema = new Schema({
    creator:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    title:{
        type:String,
        required:[true,'Title is required'],
    },
    prompt:{
        type:String,
        required:[true,'Prompt is required.'],
    },
    tag:{
        type:String,
        required:[true,'Tag is required'],
    },
    img:{
        type:String,
        required:[true,'image is required'],
    }
})

const Prompt = models.Prompt || model("Prompt",promptSchema);

export default Prompt;