const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
        category:{type:String, required:[true,'category is required']},
        title: {type: String, required:[true, 'title is required']},
        author: {type: Schema.Types.ObjectId, ref:'User'},
        status:{type:String},
        details:{type:String, required:[true,'details are required'],
                minlength:[10, 'the content should have atleast 10 characters']},
        imageurl:{type:String, required:[true,'imageurl is required']},
        offerItem: {type: String},
        Saved: {type: Boolean},
        Offered: {type: Boolean},
    },
{timestamps: true}
);

//As the object is Story the collection name in the db will be stories - lower case and plural 
const Story = mongoose.model('Story', productSchema);

module.exports = mongoose.model('Story', productSchema);