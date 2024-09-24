import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expirationDate: Date,
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

export default model("User", userSchema);
