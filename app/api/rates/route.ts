import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";
import { currencyMarkupQuery } from "@/lib/queries";

export async function GET(req: NextRequest) {

  try {

    /* =========================
       1️⃣ GET BASE CURRENCY
    ========================== */

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from")?.toUpperCase();

    if (!from) {

      return NextResponse.json(
        { success:false, error:"Base currency required"},
        { status:400 }
      );

    }

    /* =========================
       2️⃣ FETCH MARKET RATES
    ========================== */

    const res = await fetch(
      `https://open.er-api.com/v6/latest/${from}`,
      { cache:"no-store" }
    );

    if(!res.ok){

      return NextResponse.json(
        { success:false, error:"Exchange API failed"},
        { status:500 }
      );

    }

    const data = await res.json();

    if(data.result !== "success"){

      return NextResponse.json(
        { success:false, error:"Invalid currency"},
        { status:400 }
      );

    }

    const marketRates:Record<string,number> = data.rates || {};

    /* =========================
       3️⃣ FETCH SANITY MARKUP
    ========================== */

    const markupData = await sanityClient.fetch(currencyMarkupQuery);

    const markupMap:Record<
      string,
      { buyMarkup:number; sellMarkup:number }
    > = {};

    if(Array.isArray(markupData)){

      markupData.forEach((item:any)=>{

        const code = item?.currencyCode?.toUpperCase();

        if(!code) return;

        markupMap[code] = {

          buyMarkup: Number(item.buyMarkup) || 0,
          sellMarkup: Number(item.sellMarkup) || 0

        };

      });

    }

    /* =========================
       4️⃣ FINAL RATE MAP
    ========================== */

    const finalRates:Record<string,number> = {};

    Object.entries(marketRates).forEach(([currency,rate])=>{

      finalRates[currency] = Number(rate);

    });

    /* =========================
       5️⃣ RETURN RESPONSE
    ========================== */

    return NextResponse.json({

      success:true,
      base:data.base_code,
      rates:finalRates,
      markups:markupMap,
      lastUpdated:
        data.time_last_update_utc ||
        new Date().toISOString()

    });

  }

  catch(error){

    console.error("Rates API Error:",error);

    return NextResponse.json(
      { success:false, error:"Internal server error"},
      { status:500 }
    );

  }

}

// XE 

// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const from = searchParams.get("from") || "USD";

//     const accountId = process.env.XE_ACCOUNT_ID;
//     const apiKey = process.env.XE_API_KEY;

//     if (!accountId || !apiKey) {
//       return NextResponse.json(
//         { success: false, error: "XE credentials missing" },
//         { status: 500 }
//       );
//     }

//     const toCurrencies = "EUR,INR,JPY,RUB,AED,GBP";

//     const xeRes = await fetch(
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

//     if (!xeRes.ok) {
//       const text = await xeRes.text();
//       console.error("XE ERROR:", text);

//       return NextResponse.json(
//         { success: false, error: "Failed to fetch XE rates" },
//         { status: 500 }
//       );
//     }

//     const data = await xeRes.json();

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
//       updated: new Date().toISOString(),
//     });

//   } catch (error) {
//     console.error("SERVER ERROR:", error);

//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 }
//     );
//   }
// }
