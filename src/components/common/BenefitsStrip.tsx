import {
  Truck,
  RefreshCw,
  BadgeCheck,
  Handshake,
  RotateCcw,
} from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Free Shipping",
    text: "Get 100% Free Shipping",
  },
  {
    icon: RefreshCw,
    title: "Easy Exchange",
    text: "Exchange your old designs anytime",
  },
  {
    icon: BadgeCheck,
    title: "Certified Jewellery",
    text: "100% Certified Jewellery",
  },
  {
    icon: Handshake,
    title: "Lifetime Product Service",
    text: "Keep your jewellery in top shape",
  },
  {
    icon: RotateCcw,
    title: "14 Days Return",
    text: "14 Days Hassle-Free Returns",
  },
];

const BenefitsStrip = () => {
  return (
    <div className="mt-20 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-8 py-14 md:grid-cols-3 xl:grid-cols-5">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`text-center xl:px-6 ${
                index !== items.length - 1
                  ? "xl:border-r xl:border-[#f0c7a8]"
                  : ""
              }`}
            >
              <Icon className="mx-auto mb-4 h-10 w-10 text-[#d83b5b]" />
              <h3 className="text-[18px] font-medium text-[#1c1c1c]">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] text-gray-600">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BenefitsStrip;
