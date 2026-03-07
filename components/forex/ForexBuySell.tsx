"use client";

import { useState } from "react";
import { currencyList } from "@/lib/currencyList";

const cities = ["Kolkata", "Mumbai", "Hyderabad", "Other"];

export default function ForexBuySell() {

    const [tab, setTab] = useState<"buy" | "sell">("buy");

    const [city, setCity] = useState("");

    const [from, setFrom] = useState("INR");
    const [to, setTo] = useState("USD");

    const [forexAmount, setForexAmount] = useState("");
    const [inrAmount, setInrAmount] = useState("");

    const rate = 91.74;

    function handleForexChange(value: string) {

        setForexAmount(value);

        const total = Number(value) * rate;

        setInrAmount(total.toFixed(2));

    }

    return (

        <div className="max-w-3xl mx-auto bg-white border-2 border-orange-400 rounded-xl p-6">

            {/* TABS */}

            <div className="flex border-b mb-6">

                <button
                    onClick={() => setTab("buy")}
                    className={`flex-1 py-3 font-semibold ${tab === "buy" ? "border-b-4 border-orange-400 text-blue-800" : "text-gray-500"
                        }`}
                >
                    Buy Forex Cards & Currency
                </button>

                <button
                    onClick={() => setTab("sell")}
                    className={`flex-1 py-3 font-semibold ${tab === "sell" ? "border-b-4 border-orange-400 text-blue-800" : "text-gray-500"
                        }`}
                >
                    Sell Foreign Currency Notes
                </button>

            </div>

            {/* CITY */}

            <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded-lg p-3 mb-4"
            >
                <option>Select City</option>
                {cities.map(c => (
                    <option key={c}>{c}</option>
                ))}
            </select>

            {/* CURRENCY ROW */}

            <div className="grid grid-cols-2 gap-4 mb-4">

                {/* YOU HAVE */}

                <div>

                    <label className="text-sm text-gray-600">
                        Currency You Have
                    </label>

                    <select
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-1"
                    >

                        {tab === "buy" ? (

                            <option value="INR">INR - Indian Rupee</option>

                        ) : (

                            currencyList.map(c => (
                                <option key={c.code} value={c.code}>
                                    {c.code} - {c.name}
                                </option>
                            ))

                        )}

                    </select>

                </div>

                {/* YOU WANT */}

                <div>

                    <label className="text-sm text-gray-600">
                        Currency You Want
                    </label>

                    <select
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-1"
                    >

                        {tab === "buy" ? (

                            currencyList.map(c => (
                                <option key={c.code} value={c.code}>
                                    {c.code} - {c.name}
                                </option>
                            ))

                        ) : (

                            <option value="INR">INR - Indian Rupee</option>

                        )}

                    </select>

                </div>

            </div>

            {/* CURRENCY NOTES */}

            <div className="mb-4">

                <select className="w-full border rounded-lg p-3">

                    <option>Currency Notes</option>

                </select>

            </div>

            {/* FOREX AMOUNT */}

            <input
                type="number"
                placeholder="Forex Amount"
                value={forexAmount}
                onChange={(e) => handleForexChange(e.target.value)}
                className="w-full border rounded-lg p-3 mb-4"
            />

            {/* RATE */}

            <div className="flex justify-between items-center mb-4">

                <span className="text-gray-500">
                    Rate
                </span>

                <span className="font-semibold">
                    ₹ {rate}
                </span>

            </div>

            {/* INR AMOUNT */}

            <input
                type="text"
                placeholder="INR Amount"
                value={inrAmount}
                readOnly
                className="w-full border rounded-lg p-3 mb-4"
            />

            {/* TOTAL */}

            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-4">

                <span>Total Amount</span>

                <span className="text-xl font-bold">
                    ₹ {inrAmount || "0.00"}
                </span>

            </div>

            <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold">
                BOOK THIS ORDER →
            </button>

        </div>

    )

}