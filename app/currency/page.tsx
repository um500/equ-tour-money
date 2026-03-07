"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { currencyList } from "@/lib/currencyList";
import CurrencySection from "@/components/sections/CurrencySection";

export default function CurrencyPage() {

  const [tab, setTab] = useState<"buy" | "sell">("buy");

  const [amount, setAmount] = useState<string>("");

  const [from, setFrom] = useState<string>("INR");
  const [to, setTo] = useState<string>("USD");

  const [rates, setRates] = useState<Record<string, number>>({});
  const [markups, setMarkups] = useState<Record<string, any>>({});

  const [converted, setConverted] = useState<number | null>(null);

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const [loading, setLoading] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  const selectedFrom = currencyList.find((c) => c.code === from);
  const selectedTo = currencyList.find((c) => c.code === to);

  const flagUrl = (code: string) =>
    `https://flagcdn.com/w40/${code}.png`;

  /* ================= CLOSE DROPDOWN ================= */

  useEffect(() => {

    function handleClickOutside(e: MouseEvent) {

      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setOpenFrom(false);
      }

      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setOpenTo(false);
      }

    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  /* ================= FETCH API RATE + MARKUP ================= */

  useEffect(() => {

    async function fetchRates() {

      const baseCurrency = tab === "buy" ? to : from;

      try {

        const res = await fetch(`/api/rates?from=${baseCurrency}`);
        const data = await res.json();

        if (data.success) {

          setRates(data.rates);

          if (data.markups) {
            setMarkups(data.markups);
          }

        }

      } catch (err) {

        console.error("Rate fetch error", err);

      }

    }

    fetchRates();

  }, [from, to, tab]);

  /* ================= RATE CALCULATION ================= */

  let finalRate = 0;

  const baseRate = rates["INR"] || 0;

  const selectedCurrency = tab === "buy" ? to : from;

  const currencyMarkup = markups[selectedCurrency];

  if (tab === "buy") {

    finalRate = baseRate + (currencyMarkup?.buyMarkup || 0);

  } else {

    finalRate = baseRate - (currencyMarkup?.sellMarkup || 0);

  }

  /* ================= CONVERT ================= */

  const handleConvert = () => {

    if (!finalRate || !amount) return;

    setLoading(true);

    setTimeout(() => {

      setConverted(Number(amount) * finalRate);

      setLoading(false);

    }, 200);

  };

  /* ================= AUTO UPDATE ================= */

  useEffect(() => {

    if (!finalRate || !amount) return;

    setConverted(Number(amount) * finalRate);

  }, [amount, finalRate]);

  /* ================= TAB CHANGE ================= */

  useEffect(() => {

    if (tab === "buy") {

      setFrom("INR");
      setTo("USD");

    } else {

      setFrom("USD");
      setTo("INR");

    }

    setConverted(null);

  }, [tab]);

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0b1b5a] to-[#1e2f9f]">

      <section className="pt-32 pb-16 text-center text-white">

        <h1 className="text-4xl font-bold mb-4">
          Currency Exchange
        </h1>

        <p className="text-blue-200">
          Live currency conversion with real forex rates
        </p>

      </section>

      <section className="px-6 pb-20">

        <div className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-xl border-2 border-orange-400">

          <div className="flex border-b mb-6">

            <button
              onClick={() => setTab("buy")}
              className={`flex-1 py-3 font-semibold ${
                tab === "buy"
                  ? "border-b-4 border-orange-400 text-blue-800"
                  : "text-gray-500"
              }`}
            >
              Buy Forex Cards & Currency
            </button>

            <button
              onClick={() => setTab("sell")}
              className={`flex-1 py-3 font-semibold ${
                tab === "sell"
                  ? "border-b-4 border-orange-400 text-blue-800"
                  : "text-gray-500"
              }`}
            >
              Sell Foreign Currency Notes
            </button>

          </div>

          <select className="w-full border rounded-lg p-3 mb-6">
            <option>Select City</option>
            <option>Kolkata</option>
            <option>Mumbai</option>
            <option>Hyderabad</option>
            <option>Other</option>
          </select>

          <div className="grid grid-cols-2 gap-4 mb-6">

            <div ref={fromRef} className="relative">

              <label className="text-sm text-gray-500">
                Currency You Have
              </label>

              <div
                onClick={() => setOpenFrom(!openFrom)}
                className="mt-2 border rounded-lg p-3 flex justify-between cursor-pointer"
              >

                <div className="flex items-center gap-2">

                  <img
                    src={flagUrl(selectedFrom?.countryCode || "in")}
                    className="w-5 h-4"
                  />

                  {selectedFrom?.code}

                </div>

                <ChevronDown size={18} />

              </div>

              {openFrom && (

                <div className="absolute z-50 bg-white border rounded-lg shadow-lg w-full mt-2 max-h-60 overflow-y-auto">

                  {currencyList.map((currency) => (

                    <div
                      key={currency.code}
                      onClick={() => {
                        setFrom(currency.code);
                        setOpenFrom(false);
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex gap-2"
                    >

                      <img
                        src={flagUrl(currency.countryCode)}
                        className="w-5 h-4"
                      />

                      {currency.code}

                      <span className="text-gray-500 text-sm">
                        {currency.name}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>

            <div ref={toRef} className="relative">

              <label className="text-sm text-gray-500">
                Currency You Want
              </label>

              <div
                onClick={() => setOpenTo(!openTo)}
                className="mt-2 border rounded-lg p-3 flex justify-between cursor-pointer"
              >

                <div className="flex items-center gap-2">

                  <img
                    src={flagUrl(selectedTo?.countryCode || "us")}
                    className="w-5 h-4"
                  />

                  {selectedTo?.code}

                </div>

                <ChevronDown size={18} />

              </div>

              {openTo && (

                <div className="absolute z-50 bg-white border rounded-lg shadow-lg w-full mt-2 max-h-60 overflow-y-auto">

                  {currencyList.map((currency) => (

                    <div
                      key={currency.code}
                      onClick={() => {
                        setTo(currency.code);
                        setOpenTo(false);
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex gap-2"
                    >

                      <img
                        src={flagUrl(currency.countryCode)}
                        className="w-5 h-4"
                      />

                      {currency.code}

                      <span className="text-gray-500 text-sm">
                        {currency.name}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

          <input
            type="number"
            placeholder="Forex Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          />

          <div className="text-sm text-gray-500 mb-4">
            Rate = <span className="font-semibold">₹ {finalRate.toFixed(4)}</span>
          </div>

          <button
            onClick={handleConvert}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Calculating..." : "Convert"}
          </button>

          {converted !== null && (

            <div className="mt-6 border-t pt-4">

              <h2 className="text-xl font-bold">
                Total Amount = ₹ {converted.toFixed(2)}
              </h2>

            </div>

          )}

        </div>

      </section>

      <CurrencySection />

    </div>

  );
}