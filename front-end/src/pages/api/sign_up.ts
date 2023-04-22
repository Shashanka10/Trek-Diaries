import dbConnect from "../../../lib/mongoose"
import User from "../../../lib/modals/User"
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try{
            const {email, password, firstName, lastName,dob} = req.body as any
            if (await dbConnect())
            {
                console.log("Connection established....");
            }
    
            const countUser = await User.countDocuments({ email });
            console.log(countUser);
            if(countUser) //if email already exists
            {
                console.log("Duplicate Email!!!")
                return res.status(409).json({ success: false, error:"user already exists" })
            }
            
            const user:any = new User()       //create mongo model of given data and store in database       
            user.email = email;
            user.password = password;
            user.first_name = firstName;
            user.last_name = lastName;
            user.dob = dob;
            await user.save()
            console.log("User has been created...")
            return res.status(201).json({ success: true, data: user })
        }catch(error){
            return res.status(500).json({ success: false, error })
        }
    }
}