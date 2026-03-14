import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity.client";
import { currencyMarkupQuery } from "@/lib/queries";

type MarkupType = {
  buyMarkup: number;
  sellMarkup: number;
};

export async function GET(req: NextRequest) {
  try {

    /* =========================
       1️⃣ BASE CURRENCY
    ========================== */

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from")?.toUpperCase() || "INR";

    /* =========================
       2️⃣ FETCH MARKET RATES
    ========================== */

    const apiRes = await fetch(
      `https://open.er-api.com/v6/latest/${from}`,
      {
        cache: "no-store",
      }
    );

    if (!apiRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Exchange API request failed",
        },
        { status: 500 }
      );
    }

    const apiData = await apiRes.json();

    if (apiData.result !== "success") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid currency or API response",
        },
        { status: 400 }
      );
    }

    const marketRates: Record<string, number> =
      apiData?.rates || {};

    /* =========================
       3️⃣ FETCH SANITY MARKUPS
    ========================== */

    const markupData = await sanityClient.fetch(currencyMarkupQuery);

    const markups: Record<string, MarkupType> = {};

    if (Array.isArray(markupData)) {

      markupData.forEach((item: any) => {

        const code = item?.currencyCode?.toUpperCase();

        if (!code) return;

        markups[code] = {
          buyMarkup: Number(item.buyMarkup) || 0,
          sellMarkup: Number(item.sellMarkup) || 0,
        };

      });

    }

    /* =========================
       4️⃣ FINAL RESPONSE
    ========================== */

    return NextResponse.json({
      success: true,
      base: apiData.base_code,
      rates: marketRates,
      markups,
      lastUpdated:
        apiData.time_last_update_utc ||
        new Date().toISOString(),
    });

  } catch (error) {

    console.error("Rates API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );

  }
}



/* =========================================================
   🚀 XE API VERSION (FUTURE USE)
   Same structure as open.er-api
   Just uncomment and comment above code
========================================================= */

// import { NextRequest, NextResponse } from "next/server";
// import { sanityClient } from "@/lib/sanity.client";
// import { currencyMarkupQuery } from "@/lib/queries";

// type MarkupType = {
//   buyMarkup: number;
//   sellMarkup: number;
// };

// export async function GET(req: NextRequest) {
//   try {

//     /* =========================
//        1️⃣ BASE CURRENCY
//     ========================== */

//     const { searchParams } = new URL(req.url);
//     const from = searchParams.get("from")?.toUpperCase() || "USD";


//     /* =========================
//        2️⃣ XE CREDENTIALS
//     ========================== */

//     const accountId = process.env.XE_ACCOUNT_ID;
//     const apiKey = process.env.XE_API_KEY;

//     if (!accountId || !apiKey) {
//       return NextResponse.json(
//         { success: false, error: "XE credentials missing" },
//         { status: 500 }
//       );
//     }


//     /* =========================
//        3️⃣ TARGET CURRENCIES
//     ========================== */

//     const toCurrencies =
//       "INR,USD,EUR,GBP,AED,JPY,AUD,CAD,SGD,THB";


//     /* =========================
//        4️⃣ FETCH XE RATES
//     ========================== */

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

//     const xeData = await xeRes.json();


//     /* =========================
//        5️⃣ FORMAT RATES
//     ========================== */

//     const marketRates: Record<string, number> = {};

//     if (xeData?.to) {
//       xeData.to.forEach((item: any) => {
//         marketRates[item.quotecurrency] = item.mid;
//       });
//     }


//     /* =========================
//        6️⃣ FETCH SANITY MARKUPS
//     ========================== */

//     const markupData = await sanityClient.fetch(currencyMarkupQuery);

//     const markups: Record<string, MarkupType> = {};

//     if (Array.isArray(markupData)) {

//       markupData.forEach((item: any) => {

//         const code = item?.currencyCode?.toUpperCase();
//         if (!code) return;

//         markups[code] = {
//           buyMarkup: Number(item.buyMarkup) || 0,
//           sellMarkup: Number(item.sellMarkup) || 0,
//         };

//       });

//     }


//     /* =========================
//        7️⃣ FINAL RESPONSE
//     ========================== */

//     return NextResponse.json({
//       success: true,
//       base: from,
//       rates: marketRates,
//       markups,
//       lastUpdated: new Date().toISOString(),
//     });

//   } catch (error) {

//     console.error("XE API ERROR:", error);

//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 }
//     );

//   }
// }