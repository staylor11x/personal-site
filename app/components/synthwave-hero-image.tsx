"use client";

export default function SynthwaveHeroImage() {
  return (
    <div className="relative h-full min-h-56 w-full overflow-hidden">
      {/* CSS synthwave placeholder — always shown as background */}
      <SynthwavePlaceholder />
      {/*
        Drop a synthwave landscape image at /public/images/hero-synthwave.jpg
        Recommended: ~800×500px dark synthwave cityscape.
      */}
      <img
        src="/images/hero-synthwave.jpg"
        alt="Synthwave cityscape landscape"
        className="absolute inset-0 h-full w-full object-cover object-center"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

function SynthwavePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, #0a0520 0%, #1a0533 30%, #3d0a6b 55%, #ff2e8a 56%, #ff6a00 60%, #1a0533 65%, #080e17 100%)",
      }}
    >
      {/* Grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent, rgba(255,46,138,0.12)), repeating-linear-gradient(90deg, rgba(255,46,138,0.25) 0 1px, transparent 1px 40px), repeating-linear-gradient(0deg, rgba(255,46,138,0.25) 0 1px, transparent 1px 30px)",
          backgroundSize: "40px 30px",
          transform: "perspective(200px) rotateX(40deg)",
          transformOrigin: "bottom",
        }}
      />
      {/* Sun */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "30%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffb347 0%, #ff6a00 40%, #ff2e8a 70%, transparent 100%)",
          boxShadow: "0 0 40px rgba(255,110,0,0.6), 0 0 80px rgba(255,46,138,0.3)",
        }}
      />
      {/* Scan lines overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />
    </div>
  );
}
