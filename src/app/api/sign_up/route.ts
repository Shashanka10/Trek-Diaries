import dbConnect from "../../../../lib/mongoose";
import User from "../../../../lib/modals/User";
import sendEmail from "../../../lib/nodemailer";
import Token from "../../../../lib/modals/Token";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/zodSchema/signup";

export async function POST(req: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const { email, password, firstName, lastName, dob} = signupSchema.parse(await req.json())

    const fullName: String = `${firstName} ${lastName}`;
    if (await dbConnect()) {
      console.log("Connection established....");
    }

    const countUser = await User.countDocuments({ email });
    console.log(countUser);

    if (countUser) {
      //if email already exists
      console.log("Duplicate Email!!!");
      return NextResponse.json(
        { success: false, error: "user already exists" },
        { status: 400 }
      );
    }

    const user: any = new User(); //create mongo model of given data and store in database
    user.email = email;
    user.password = password;
    user.first_name = firstName;
    user.last_name = lastName;
    user.name = fullName;
    user.dob = dob;
    await user.save();

    const token: any = new Token();
    token.token = crypto.randomBytes(32).toString("hex");
    await token.save();

    const url: any = `${baseUrl}users/${user._id}/verify/${token.token}`;
    // console.log(`user has been created: ${user}`)
    // console.log(`token has been created: ${token}`)
    console.log(`url: ${url}`);
    await sendEmail(user.email, "Verification Mail", url);

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
