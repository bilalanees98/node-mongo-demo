const mongoose = require("mongoose");
const modelName = "Posts";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    createdAt: { type: Date, default: Date.now, select: false },
    updatedAt: { type: Date, default: Date.now, select: false },
  },
  { collection: modelName }
);

//for deletedAt timestamp
schema.plugin(require("mongoose-delete"), { deletedAt: true });

module.exports = mongoose.model(modelName, schema);
