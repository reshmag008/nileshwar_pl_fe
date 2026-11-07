
import { Pause, Trophy } from "lucide-react";

const AuctionBreakScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 px-4">
      <div className="text-center max-w-md w-full">

        {/* Animated Loader */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-36 h-36 rounded-full border-4 border-amber-500/20 animate-ping" />

          <div className="w-28 h-28 rounded-full border-4 border-amber-500 border-t-transparent animate-spin flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Pause size={38} className="text-amber-400" />
            </div>
          </div>
        </div>

        {/* Trophy */}
        <div className="flex items-center justify-center gap-2 text-amber-400 mb-4">
          <Trophy size={22} />
          <span className="font-bold tracking-[3px] text-sm uppercase">
            Live Auction
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Auction on Break!
        </h1>

        <p className="text-gray-400 text-base leading-relaxed mb-8">
          The auction is temporarily paused.
          Please stay tuned. We'll be back shortly!
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/30">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
          </span>
          <span className="text-amber-400 font-semibold text-sm tracking-wide">
            AUCTION PAUSED
          </span>
        </div>

        <p className="text-gray-600 text-xs mt-10 tracking-widest uppercase">
          Thank you for your patience
        </p>

      </div>
    </div>
  );
};

export default AuctionBreakScreen;
