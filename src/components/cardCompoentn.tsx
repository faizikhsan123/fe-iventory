import { Truck, Check, X, Info } from "lucide-react";
import React from "react";

const cards = [
  {
    icon: Truck,
    value: 5,
    label: "Total Supplier",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Check,
    value: 4,
    label: "Aktif",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: X,
    value: 1,
    label: "Tidak Aktif",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    icon: Info,
    value: 5,
    label: "Kota",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const CardComponent = () => {
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-neutral-primary-soft flex items-center gap-4 p-6 border border-default rounded-base shadow-xs"
        >
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${card.iconBg}`}>
            <card.icon className={`w-6 h-6 ${card.iconColor}`} />
          </div>
          <div>
            <p className="text-3xl font-bold text-black">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardComponent;
