import React from "react";

interface AuthHeaderProps {
  logo: string;
  title: string;
  subtitle: string;
  className?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  logo,
  title,
  subtitle,
  className,
}) => (
  <>
    <div className={`flex flex-col items-center mb-8 ${className}`}>
      <img src={logo} alt="Logo" className="w-24 h-24 object-contain mb-2" />
    </div>
    <h2 className="text-2xl font-bold text-[#484C56] mb-2 text-center tracking-tight">
      {title}
    </h2>
    <p className="text-[#5B7F95] mb-8 text-center text-base">{subtitle}</p>
  </>
);

export default AuthHeader;
