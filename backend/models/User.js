const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        role: {  
            type: String,
            enum: ["admin", "user"],
            default: "user",
            required: true
        },
        un: {
            type: String,
            required: true,
            unique: true
        },
        pwd: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);



// const UserSchema = new Schema(
//     {
//         // employee_number: {
//         //     type: Number,
//         //     required: true,
//         //     unique: true
//         // },
//         employee_name: {
//             type: String,
//             required: true
//         },
//         employee_id_number: {
//             type: String,
//             required: true,
//             unique: true
//         },

//         email: {
//             type: String,
//             required: true,
//             unique: true  
//         },
//         phone_number: {
//             type: Number
//         },
//         employee_password: {
//             type: String,
//             required: true,
//             unique: true
//         },
//         role: {  
//             type: String,
//             enum: ["admin", "user"],
//             default: "user",
//             required: true
//         },


//         department: {
//             type: String,
//             required: true
//         },
//         position: {
//             type: String
//         },
        
//     },
//     { timestamps: true }
// );

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;