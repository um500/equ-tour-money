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

    // =========================
    // 1️⃣ Basic Validation
    // =========================
    if (
      !name ||
      !email ||
      !mobile ||
      !amount ||
      !address ||
      !from ||
      !to ||
      !rate
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email ENV missing");
      return NextResponse.json(
        { success: false, error: "Email configuration missing" },
        { status: 500 }
      );
    }

    // =========================
    // 2️⃣ Create Transporter
    // =========================
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // =========================
    // 3️⃣ Calculate Total
    // =========================
    const total = (Number(amount) * Number(rate)).toFixed(2);

    // =========================
    // 4️⃣ Send Mail
    // =========================
    await transporter.sendMail({
      from: `"Exchange Request" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Currency Exchange Request 💰",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>💱 New Exchange Request</h2>
          <hr />

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>From:</strong> ${from}</p>
          <p><strong>To:</strong> ${to}</p>
          <p><strong>Rate Applied:</strong> ${rate}</p>
          <p><strong>Amount:</strong> ${amount}</p>

          <h3>💰 Total Conversion: ${total} ${to}</h3>

          <p><strong>Address:</strong> ${address}</p>

          <hr />
          <p style="font-size:12px;color:gray;">
            This request was generated from your website.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Email failed to send" },
      { status: 500 }
    );
  }
}