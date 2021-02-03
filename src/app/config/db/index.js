
const mongoose=require('mongoose');
async function connect(){
    try {
        await mongoose.connect('mongodb+srv://phamvanluc:2bkfj0VNQVnrtmO5@cluster0.d62qx.mongodb.net/sino_shop?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    console.log('connect succesfully');
    } catch (error) {
        console.log('fail');
    }
};
module.exports={connect};