const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { assert } = require('console');
const { stringify } = require('querystring');
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    dateCreated: { type: Date, required: true, default: Date.now }
});

const User = mongoose.model('Orders', userSchema);
async function createUserEntity(user) {
    return await new User(user).save();
}

async function findUserEntity(email) {
    const found = await User.findOne({ email });
    return Promise.resolve(found !== null)
}

async function setup(user) {
    const found = await findUserEntity(user.email);
    if (found) {
        throw new Error("User already registered")
    } else {
        const newUser = await createUserEntity(user);
        console.log(`User successfully created with the following ID: ${newUser._id}`)
    }
}

let mongoUrl = `mongodb://localhost/stcpay`;
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then(async () => {
        console.log('Successfully connected to mongodb');
        await setup({
            email: "hellofromMys2ide@gmail.com",
            name: "alaa"
        });
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
