import { NextResponse } from "next/server";

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
      rate
    } = body;

    // validation
    if (!name || !email || !mobile || !amount || !address || !from || !to || !rate) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // total calculate
    const total = (Number(amount) * Number(rate)).toFixed(2);

    // ===============================
    // 1️⃣ SAVE DATA TO GOOGLE SHEET
    // ===============================
    await fetch(
      "https://script.google.com/macros/s/AKfycbwnpa1dnqbH_CUTnHzQYT-nFjVSTx-RRHev5p34rV7ULun_ncG_5fv6Udd5GRQT3Zml/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          amount,
          address,
          from,
          to,
          rate,
          total
        })
      }
    );

    // ===============================
    // 2️⃣ WHATSAPP MESSAGE
    // ===============================
    const message = `
💱 Currency Exchange Request

Name: ${name}
Email: ${email}
Mobile: ${mobile}

From: ${from}
To: ${to}

Amount: ${amount}
Rate: ${rate}

Converted Amount: ${total} ${to}

Address:
${address}
`;

    const whatsappLink =
      `https://wa.me/918969457707?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      whatsapp: whatsappLink
    });

  } catch (error) {

    console.error("Exchange API Error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}