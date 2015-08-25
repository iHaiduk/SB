mongoose = require("mongoose")
Schema = mongoose.Schema

module.exports = (model_name, params)->
  mongooseModel = new Schema(params)
  mongoose.model(model_name, mongooseModel)