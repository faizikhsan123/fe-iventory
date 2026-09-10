import type { Sambutan } from "@/types/properties/Sambutan";
import { Plus } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const SambutanCoomponent = (props: Sambutan) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-5 flex justify-between items-center mt-10">
      <div>
        <h1 className="text-black text-xl font-bold">{props.paragraf1}</h1>
        <h2 className="text-slate-500 text-sm mt-1">{props.paragraf2}</h2>
      </div>
      <div>
        <button
          onClick={props.onclick}
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors"
        >
          <Link to={""} />
          <Plus
            size={16}
            strokeWidth={3}
          />
          {props.button?.replace(/^\+\s*/, "")}
        </button>
      </div>
    </div>
  );
};

export default SambutanCoomponent;
