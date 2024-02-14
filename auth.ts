import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { connectToMongoDB } from "./lib/db"
import User from "./models/userModel";
import login from './app/(auth)/login/page';
export const { handlers, auth } = NextAuth({ providers: [ GitHub({
    clientId:process.env.AUTH_GITHUB_ID,
    clientSecret:process.env.AUTH_GITHUB_SECRECT
}) ],
secret:process.env.AUTH_SECRET,

    callbacks:{
        async signIn({account,profile}){
            if(account?.provider==='github'){
                await connectToMongoDB();
                try {
                    const user = await User.findOne({email:profile?.email});
                //Signup the user if it doesn't exist
                    if(!user){
                        const newUser = await User.create({
                            username:profile?.login,
                            email:profile?.email,
                            fullName:profile?.name,
                            avatar:profile?.avatar_url,
                        })
                        await newUser.save();
                    }
                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }
            return false;
        }
    }
 })