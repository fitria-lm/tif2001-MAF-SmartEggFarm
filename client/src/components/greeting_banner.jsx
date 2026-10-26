import bannerDashboard from "../assets/banner_dashboard.png";

export default function GreetingBanner() {
  return (
    <div className="relative h-36 overflow-hidden rounded-3xl md:h-60">
      <img
        src={bannerDashboard}
        alt="Banner Smart Egg Farm"
        className="h-full w-full object-cover object-right"
      />
    </div>
  );
}