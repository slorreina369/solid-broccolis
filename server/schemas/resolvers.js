const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query:{
        me: async({user, params}, res) =>{
            if(context.user){
                const userData = await User.findOne({_id:context.user._id})
                    .select('-_v -password')
            }
        },
        users:async() =>{
            return User.find()
                .select('-_v -password')
                .populate('book');
        },
        user:async(parent, { username }) =>{
            return User.findOne({ username })
                .select('-_v -password')
                .populate('books');
        }
    },
    Mutation:{
        addUser:async(parent, args) =>{
            const user = await User.create(args);
            
            return user;
        },
        login: async(parents, { email, password }) =>{
            const user = await User.findOne({email});
            if(!user){
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('Incorrect credentials');
            }

            return { user };
        }

    }
};

module.exports = resolvers;