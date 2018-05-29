const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});

userSchema.methods.serialize = function(){
	return {
		username: this.username
	};
}

userSchema.methods.passwordValidate = function(password){
	return bcryptjs.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password){
	return bcryptjs.hash(password, 12);
}

const User = mongoose.model('User', userSchema);

module.exports = {User};