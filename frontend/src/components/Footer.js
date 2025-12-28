import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-sky-950 text-white py-6 mt-10">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} OneClickLoan. All Rights Reserved.
        </p>

        <div className="flex justify-center space-x-4 mt-3">
          <Link to="#" className="hover:text-blue-400">Privacy Policy</Link>
          <Link to="#" className="hover:text-blue-400">Terms</Link>
          <Link to="#" className="hover:text-blue-400">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
