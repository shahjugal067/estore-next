import dbConnect from "@/utils/config/dbConnection";
import User from '@/utils/models/User.js'
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'
import bcryptjs from 'bcryptjs'
import toast from "react-hot-toast";


const DEFAUL_PROFILE_IMAGE =  "https://cdn.pixabay.com/photo/2022/10/02/01/58/technology-7492577_640.jpg";

async function createUser(email,password,name){
    const hashedPassword = await bcryptjs.hash(password,10)

    const newUser = new User({
        email, password:hashedPassword,name,
        prifileImage:DEFAUL_PROFILE_IMAGE,
    });
     await newUser.save()
};
export const authOptions = {
    providers:[
        CredentialsProvider({
            name:'credentials',
            credentials:{},
            async authorize(credentials){
                const { email, password, name,isRegister } = credentials;
                try {
                    await dbConnect();
                     const  user = await User.findOne({email})
                     if(isRegister){
                        if(user){
                            toast.error("User already registered")
                        }
                        user = await createUser(email,password,name);
                     }else{
                        if(!user){
                            return null;
                        }
                        const passwordMatch = await bcryptjs.compare(password,user.password)
                        if(!passwordMatch){
                            return null;
                        }
                     }

                     if(!user.profileImage){
                        user.profileImage = DEFAUL_PROFILE_IMAGE;
                        await user.save()
                     }
                     return user;
                } catch (error) {
                    console.log(error);
                    toast.error("Error at authorized user ",error);
                    return false;

                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session:{
        strategy: 'jwt'
    },
    callbacks: {
        async singIn({user,account}){
            if(account.provider === 'google'){
                try {
                    const {email,name,image } = user;
                    await dbConnect();
                    const foundUser = await User.findOne({email})
                    if(!foundUser){
                        const newUser = new User({
                            email, name, profileImage:image || DEFAUL_PROFILE_IMAGE,
                        });
                        foundUser = await newUser.save();

                    }else if(!foundUser.profileImage || foundUser.profileImage === DEFAUL_PROFILE_IMAGE){
                      foundUser.profileImage = image || DEFAUL_PROFILE_IMAGE;
                      await foundUser.save();
                    }
                    user._id = foundUser._id.toString();
                    user.name = foundUser.name;
                    user.email = foundUser.email;
                    user.notificationPreferences = foundUser.notificationPreferences;
                    user.admin = foundUser.admin;
                    user.profileImage = foundUser.profileImage;

                    console.log("USer logged in",user);
                    return true;
                       
                } catch (error) {
                    console.log(error)
                    toast.error("Error at authorized user ",error);
                    return false;
                }
            }
            return true;
        },
         async jwt ({token,user,trigger,session}){
            if(user){
                token._id = user._id.toString();
                token.email = user.email;
                token.name = user.name;
                token.notificationPreferences = user.notificationPreferences;
                token.admin = user.admin;
                token.profileImage = user.profileImage;
            }
            if(trigger === "update" && session){
                token.name = session.user.name;
                token.email = session.user.email;
                token.profileImage = session.user.profileImage;

            }
            return token;
         },
         async session({ session,token }){
            if(session.user){
                session.user._id = token._id;
            session.user.email = token.email;
            session.user.name = token.name;
            session.user.notificationPreferences = token.notificationPreferences;
            session.user.admin = token.admin;
            session.user.profileImage = token.profileImage;
            
            }
            return session;
         },
    },
    secret: process.env.JWT_SECRET,
    pages: {
        singIn: '/'
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };