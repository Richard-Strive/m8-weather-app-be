const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  surname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  favCities: [],

  refreshTokens: [],
});

UserSchema.statics.findByCredentials = async function (surname, plainPW) {
  console.log(this);
  const user = await this.findOne({ surname });

  console.log("this is the user found", user);

  if (user) {
    // const isMatch = await bcrypt.compare(plainPW, user.password);
    const isMatch = await (plainPW === user.password);
    if (isMatch) return user;
    else console.log("Password incorrect");
  } else {
    console.log("No user whit this credentials found");
  }
};

module.exports = model("User", UserSchema);
