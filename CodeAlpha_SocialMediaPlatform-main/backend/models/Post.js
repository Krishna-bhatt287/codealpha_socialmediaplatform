const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({

    userId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required:true

    },


    content:{

        type:String,

        required:true

    },


    likes:{

        type:Number,

        default:0

    },


    comments:[

        {

            userId:{

                type:mongoose.Schema.Types.ObjectId,

                ref:"User"

            },

            text:String,

            createdAt:{

                type:Date,

                default:Date.now

            }

        }

    ]


},
{
    timestamps:true
});


module.exports = mongoose.model("Post",postSchema);