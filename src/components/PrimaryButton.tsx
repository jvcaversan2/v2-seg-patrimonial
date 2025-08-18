import React from "react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className="w-full py-2 bg-[#2196C9] hover:bg-[#176b8a] text-white font-bold rounded-lg transition text-base shadow-md mt-2 focus:outline-none focus:ring-2 focus:ring-[#2196C9] focus:ring-offset-2"
  >
    {children}
  </button>
);

export default PrimaryButton;
