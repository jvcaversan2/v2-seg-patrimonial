import React from "react";

interface InputWithIconProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  children: React.ReactNode; // Ícone SVG
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete = "off",
  children,
}) => (
  <div className="relative">
    <span className="absolute left-3 top-2.5 text-[#2196C9]">{children}</span>
    <input
      id={id}
      type={type}
      required={required}
      className="w-full pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196C9] focus:border-[#2196C9] transition placeholder:text-[#b0b8c1] text-[#484C56] bg-white"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
    />
  </div>
);

export default InputWithIcon;
