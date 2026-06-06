export default function SynthwaveHeroImage() {
  return (
    <div className="relative h-full min-h-56 w-full overflow-hidden">
      <img
        src="/images/site-pic.png"
        alt="Swirly plant abstract art"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </div>
  );
}
