import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      mobile,
      amount,
      address,
      from,
      to,
      rate,
    } = body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("ENV Missing");
      return NextResponse.json(
        { success: false, error: "Email config missing" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Currency Exchange Request 💰",
      html: `
        <h2>Exchange Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>From:</strong> ${from}</p>
        <p><strong>To:</strong> ${to}</p>
        <p><strong>Rate:</strong> ${rate}</p>
        <p><strong>Amount:</strong> ${amount}</p>
        <p><strong>Address:</strong> ${address}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Email failed" },
      { status: 500 }
    );
  }
}