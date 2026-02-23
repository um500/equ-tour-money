export async function getRates(baseCurrency: string) {
  try {
    if (!baseCurrency) {
      throw new Error("Base currency missing");
    }

    const res = await fetch(
      `/api/rates?from=${baseCurrency}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.error || "Failed to fetch rates");
    }

    const data = await res.json();

    return {
      success: true,
      base: data.base,
      rates: data.rates || {},
      lastUpdated: data.lastUpdated || null,
    };

  } catch (error) {
    console.error("Rate Fetch Error:", error);

    return {
      success: false,
      base: null,
      rates: {},
      lastUpdated: null,
    };
  }
}