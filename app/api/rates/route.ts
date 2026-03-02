import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from")?.toUpperCase();

    // ✅ Validation
    if (!from) {
      return NextResponse.json(
        { success: false, error: "Base currency is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch exchange rates
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${from}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    // ✅ Check API response properly
    if (!response.ok || data.result !== "success") {
      return NextResponse.json(
        { success: false, error: "Invalid currency code or API failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      base: data.base_code, // safer than using 'from'
      rates: data.rates || {},
      lastUpdated: data.time_last_update_utc || null,
    });

  } catch (error) {
    console.error("Exchange API Error:", error);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}


// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const from = searchParams.get("from");

//     if (!from) {
//       return NextResponse.json(
//         { success: false, error: "Base currency is required" },
//         { status: 400 }
//       );
//     }

//     const accountId = process.env.XE_ACCOUNT_ID!;
//     const apiKey = process.env.XE_API_KEY!;

//     const toCurrencies = "EUR,INR,JPY,RUB,AED,GBP";

//     const response = await fetch(
//       `https://xecdapi.xe.com/v1/convert_from.json/?from=${from}&to=${toCurrencies}`,
//       {
//         headers: {
//           Authorization:
//             "Basic " +
//             Buffer.from(`${accountId}:${apiKey}`).toString("base64"),
//         },
//         cache: "no-store",
//       }
//     );

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("XE ERROR:", errorText);

//       return NextResponse.json(
//         { success: false, error: "XE API failed" },
//         { status: 500 }
//       );
//     }

//     const data = await response.json();

//     // 🔥 VERY IMPORTANT — Check raw data
//     console.log("XE RAW:", data);

//     const rates: Record<string, number> = {};

//     if (data?.to) {
//       data.to.forEach((item: any) => {
//         rates[item.quotecurrency] = item.mid;
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       base: from,
//       rates,
//       lastUpdated: new Date().toISOString(),
//     });

//   } catch (error) {
//     console.error("Server error:", error);

//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }