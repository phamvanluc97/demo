const { mongoose } = require("mongoose")

module.exports={
    multipleMongooseToObject:function(mongooseArrays)
    {
        return mongooseArrays.map(mongoose=>mongoose.toObject());
    },
    mongooseToObject:function(mongooseObject)
    {
        return mongooseObject?mongooseObject.toObject():mongooseObject;
    }
}