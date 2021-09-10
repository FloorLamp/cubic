import React from "react";
import { FaGithub, FaTelegram } from "react-icons/fa";
import { canisterId } from "../../declarations/Cubic";

export default function Footer() {
  return (
    <footer className="py-8 flex items-center justify-center gap-4 transition-opacity text-white">
      <a
        href={`https://ic.rocks/principal/${canisterId}`}
        className="opacity-50 hover:opacity-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/img/ic.rocks-logo.svg" className="w-4" />
      </a>
      <a
        href="https://github.com/FloorLamp/cubic"
        className="opacity-50 hover:opacity-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub />
      </a>
      <a
        href="https://t.me/cubicplace"
        className="opacity-50 hover:opacity-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTelegram />
      </a>
    </footer>
  );
}
