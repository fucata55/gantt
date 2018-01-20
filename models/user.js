const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    }
});

userSchema.methods.validatePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, isValid) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
};

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: false
    },
    projectPredeccesor: {
        type: String,
        required: false
    },
    projectDuration: {
        type: String,
        required: false
    },
    projectStart: {
        type: String,
        required: false
    },
    projectEnd: {
        type: String,
        required: false
    },
    projectStatus: {
        type: String,
        required: false
    },
    projectOwner: {
        type: String,
        required: false
    }
})

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
module.exports = {
    User,
    Project
}
