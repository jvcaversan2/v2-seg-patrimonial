import React from "react";

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
  asLink?: boolean; // Se true, usa <Link> do react-router-dom
}

import { Link } from "react-router-dom";

const AuthFooter: React.FC<AuthFooterProps> = ({
  text,
  linkText,
  linkHref,
  asLink = false,
}) => (
  <div className="mt-8 text-center">
    <span className="text-[#484C56]">{text}</span>{" "}
    {asLink ? (
      <Link
        to={linkHref}
        className="text-[#B85C2B] font-semibold hover:underline ml-1"
      >
        {linkText}
      </Link>
    ) : (
      <a
        href={linkHref}
        className="text-[#B85C2B] font-semibold hover:underline ml-1"
      >
        {linkText}
      </a>
    )}
  </div>
);

export default AuthFooter;
