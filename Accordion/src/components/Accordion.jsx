import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Accordion = ({ data }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return !data || (data.length === 0) ? "No items available" : (
    <div className="min-h-screen w-full bg-black px-4 py-20">
      <div className="mx-auto w-full max-w-2xl space-y-3">
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="rounded-lg border border-gray-800 bg-gray-950"
            >
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-medium text-white hover:bg-gray-900"
                onClick={() => handleToggle(index)}
              >
                {item.title}
                {openIndex === index ? (
                  <FaChevronUp className="h-3 w-3 text-gray-500" />
                ) : (
                  <FaChevronDown className="h-3 w-3 text-gray-500" />
                )}
              </button>

              {openIndex === index && (
                <div className="border-t border-gray-800 px-5 py-4 text-sm leading-relaxed text-gray-400">
                  {item.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Accordion;