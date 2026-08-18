'use client';

import MarketFacts from '../src/components/MarketFacts';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full relative overflow-hidden bg-[#0c1324] text-[#dce1fb] min-h-screen">
      {/* Background decorative glowing elements */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#5af0b3]/5 blur-[120px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#3333c2]/10 blur-[100px]"></div>
      </div>

      {/* Hero Section */}
      <section className="w-full min-h-[600px] flex items-center justify-center pt-20 px-6 sm:px-10 relative z-10">
        <div className="max-w-[1280px] mx-auto w-full flex flex-col items-center text-center gap-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#191f31] border border-[#2e3447] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#5af0b3] animate-pulse"></span>
            <span className="text-[#bbcac0] text-xs font-semibold tracking-widest uppercase font-mono">
              Live Tracking Karachi Vendors Prices
            </span>
          </div>

          <h1 className="text-[#dce1fb] font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight max-w-4xl">
            Never Get OverCharged Again
          </h1>

          <p className="text-[#bbcac0] text-lg sm:text-xl max-w-2xl leading-relaxed">
            Real-time market price tracking and shopkeeper safeguard features to ensure fair trade for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto justify-center">
            <Link
              href="#about"
              className="px-8 py-4 bg-[#5af0b3] text-[#003825] font-semibold text-xs tracking-wider uppercase rounded-xl shadow-[0_0_20px_rgba(90,240,179,0.3)] hover:shadow-[0_0_30px_rgba(90,240,179,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              EXPLORE PLATFORM
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full bg-[#191f31] py-24 relative z-20 border-t border-b border-[#2e3447]/50">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Image Container */}
            <div className="grid grid-cols-1 gap-6 w-full">
              <div className="relative h-[280px] w-full rounded-2xl overflow-hidden shadow-2xl group border border-[#2e3447]">
                <div
                  className="absolute inset-0 bg-cover bg-center w-full h-full mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB40uskCico2vm6cN4kALcW5qAXMtG0HWNUnpP7-X-twgS7AlwvZUiUGCy2MyWOSD7K_M5ZL5VnFOH5pOt3_YNvYtcTIWL3ckfLxvGpu8co6m-oF_a--Yvx4lsL6uIBtWPNgjjhoLKbxOO0brdQcyDDdWGuluXfAjd--wmBFaZjAjFT8OcTQelPUwFbmWrDZRwDxMhjZDR4XTWtFQMXjc4W19gRJPLFFrk3hTLdFZKiS5jLmGzwoRzn_g')`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#191f31] via-[#191f31]/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0c1324]/80 backdrop-blur-xl border border-[#2e3447] rounded-xl">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-[#dce1fb] font-semibold text-lg">Merchant Safeguard</h4>
                  </div>
                  <p className="text-[#bbcac0] text-xs">
                    Dynamic pricing models protect small vendors from volatile market shifts.
                  </p>
                </div>
              </div>

              <div className="relative h-[280px] w-full rounded-2xl overflow-hidden shadow-2xl group border border-[#2e3447]">
                <div
                  className="absolute inset-0 bg-cover bg-center w-full h-full mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7i1-gkPqHQELTCh_EmF6VLTNEDshSjIk2OMbAmcVgWXSOek6sFyrD-u8iN21k3kSCFWOTGHKKCA_440AhaYeZzAev4LLRvw59MURTE4zZwnUa2yiHLI9wVbPfJw_8QhaqcOhQUe576hi8gS1G03SJYRlJEVnEP7i3e27pA7WtrowzuS5aZIiyrh5Xuxq2mJgxg1bMRttXbvf5YwX0-QB2Wps5_n5zm-PcMvutBWa5sHazApKgK3WmJA')`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#191f31] via-[#191f31]/40 to-transparent"></div>
              </div>
            </div>

            {/* About Copy */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-[#5af0b3] text-xs font-semibold tracking-widest uppercase mb-4 flex items-center gap-2 font-mono">
                  <span className="w-8 h-[1px] bg-[#5af0b3]"></span> ABOUT QEEMATCHECK
                </h2>
                <h3 className="text-[#dce1fb] font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">
                  Bridging the Gap in Karachi&apos;s Markets
                </h3>
              </div>
              <p className="text-[#bbcac0] text-lg leading-relaxed">
                Built for Karachiites, QeematCheck bridges the gap between everyday consumers and local merchants. We provide real-time market price transparency to protect citizens from unfair overcharging across city bazaars.
              </p>
              <p className="text-[#bbcac0] text-lg leading-relaxed">
                Simultaneously, we embed smart pricing safeguards that protect small shop owners from operating losses and volatile wholesale market shifts. Fair trade, transparent markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Facts Section */}
      <MarketFacts />
    </div>
  );
}