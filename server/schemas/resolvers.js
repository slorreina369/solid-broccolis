const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query:{
        me: async(parents, args, context) =>{
            if(context.user){
                const userData = await User.findOne({_id:context.user._id})
                    .select('-_v -password');

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
        users:async() =>{
            return User.find()
                .select('-_v -password')
                .populate('book');
        }
    },
    Mutation:{
        addUser:async(parent, args) =>{
            const user = await User.create(args);
            const token = signToken(user);
            
            return { token, user };
        },
        login: async(parents, { email, password }) =>{
            console.log('me me me')
            const user = await User.findOne({email});
            if(!user){
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        savedBook: async(parent, args, context) =>{
            if(context.user){
                console.log(args);
                const bookData = args.bookData;
                if(!bookData){
                    throw new Error ('Book is null')
                }
                return User.findOneAndUpdate(
                    {_id:context.user._id},
                    {$addToSet:{ savedBooks:bookData} },
                    { new:true }
                );
            }
            throw new AuthenticationError("You need to log in!");
        },
        removeBook: async(parent, { bookId }, context)=>{
            if(context.user){
                console.log({user:context.user});
                return User.findOneAndUpdate(
                    {_id:context.user._id},
                    {$pull:{ savedBooks: {bookId}} },
                    {new:true}
                );
            }
            throw new AuthenticationError('You need to log in');
        }
    }
};

module.exports = resolvers;