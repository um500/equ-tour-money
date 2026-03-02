import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";
import { currencyMarkupQuery } from "@/lib/queries";

export async function GET(req: NextRequest) {
  try {
    // =========================
    // 1️⃣ Get Base Currency
    // =========================
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from")?.toUpperCase();

    if (!from) {
      return NextResponse.json(
        { success: false, error: "Base currency is required" },
        { status: 400 }
      );
    }

    // =========================
    // 2️⃣ Fetch Market Rates
    // =========================
    const exchangeRes = await fetch(
      `https://open.er-api.com/v6/latest/${from}`,
      { cache: "no-store" }
    );

    if (!exchangeRes.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch exchange rates" },
        { status: 500 }
      );
    }

    const exchangeData = await exchangeRes.json();

    if (exchangeData.result !== "success") {
      return NextResponse.json(
        { success: false, error: "Invalid currency code" },
        { status: 400 }
      );
    }

    const marketRates: Record<string, number> =
      exchangeData.rates || {};

    // =========================
    // 3️⃣ Fetch Markup From Sanity
    // =========================
    let markupMap: Record<string, number> = {};

    try {
      const markupData = await sanityClient.fetch(currencyMarkupQuery);

      markupData?.forEach((item: any) => {
        if (item.currencyCode) {
          markupMap[item.currencyCode.toUpperCase()] =
            Number(item.markupValue) || 0;
        }
      });
    } catch (sanityError) {
      console.error("Sanity fetch error:", sanityError);
      // Continue without markup if Sanity fails
    }

    // =========================
    // 4️⃣ Merge Market + Markup
    // =========================
    const finalRates: Record<string, number> = {};

    Object.entries(marketRates).forEach(([currency, rate]) => {
      const markup = markupMap[currency] || 0;

      finalRates[currency] = Number(
        (Number(rate) + Number(markup)).toFixed(4)
      );
    });

    // =========================
    // 5️⃣ Return Final Response
    // =========================
    return NextResponse.json({
      success: true,
      base: exchangeData.base_code,
      rates: finalRates,
      lastUpdated:
        exchangeData.time_last_update_utc || new Date().toISOString(),
    });

  } catch (error) {
    console.error("Exchange + Markup API Error:", error);

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