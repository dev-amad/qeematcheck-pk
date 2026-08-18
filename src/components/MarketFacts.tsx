import React from 'react';

interface MarketFact {
    id: string;
    title: string;
    description: string;
}

const FACTS: MarketFact[] = [
    {
        id: '01',
        title: 'Daily Rate Discrepancies',
        description:
            'Official government rate lists are updated often, yet retail prices in high-density bazaars often fluctuate by 10-15% based on wholesale supply shifts.',
    },
    {
        id: '02',
        title: 'Wholesale Price Drivers',
        description:
            'Rate Lists operate as the primary pricing baseline for pulses, grains, and dry groceries across Karachi, setting morning prices before retail trading begins.',
    },
    {
        id: '03',
        title: 'Perishable Spikes',
        description:
            'Perishable produce such as tomatoes and onions experience the highest intraday price volatility due to transportation logistics.',
    },
    {
        id: '04',
        title: 'Crowdsourced Verification',
        description:
            'Cross-verifying consumer-reported shopkeeper prices against daily official benchmarks helps identify unfair markups and promotes fair trade practices.',
    },
    {
        id: '05',
        title: 'Vendor Margin Protection',
        description:
            'Small vendors face slim profit margins compared to wholesalers; transparent price tracking helps protect honest shopkeepers from unexpected wholesale price spikes.',
    },
];

export default function MarketFacts() {
    return (
        <section className="w-full py-16 bg-[#0c1324] border-t border-[#2e3447]/50">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="mb-10 text-center sm:text-left">
                    <h2 className="text-[#5af0b3] text-xs font-semibold tracking-widest uppercase mb-2 font-mono flex items-center justify-center sm:justify-start gap-2">
                        <span className="w-6 h-[1px] bg-[#5af0b3]"></span> KEY MARKET INSIGHTS
                    </h2>
                    <h3 className="text-[#dce1fb] font-bold text-2xl sm:text-3xl md:text-4xl">
                        Understanding Karachi Bazaar Pricing
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FACTS.map((fact) => (
                        <div
                            key={fact.id}
                            className="bg-[#191f31] border border-[#2e3447] p-6 rounded-2xl flex flex-col justify-between hover:border-[#5af0b3]/40 transition-colors duration-300"
                        >
                            <div>
                                <span className="text-[#5af0b3] font-mono text-xs font-bold tracking-wider uppercase block mb-3">
                                    FACT #{fact.id}
                                </span>
                                <h4 className="text-[#dce1fb] font-semibold text-lg mb-2">
                                    {fact.title}
                                </h4>
                                <p className="text-[#bbcac0] text-sm leading-relaxed">
                                    {fact.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}