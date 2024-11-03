// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    
    fname: {
        type: String,
        required: true
    },

    lname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    profile_pix: {
        type: String,
        required: false
    }, args: [{
        type: mongoose.Schema,
        required: true,
        default: function() {
          return { username: 'HackNC', password: 'NCHACK', fname: 'HackNC', lname: '2024', email: 'hacknc@unc.edu' }
        }
    }]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10); 
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;


