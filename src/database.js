const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb+srv://7jram:thoneonejhbr@cluster0-yjdde.mongodb.net/innhouse?retryWrites=true&w=majority')
    //mongoose.connect('mongodb://127.0.0.1:27017/inhouse')
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));
