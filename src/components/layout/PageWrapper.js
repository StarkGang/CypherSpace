"use client";
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NodeNetworkBackground from "../design-system/NodeNetworkBackground";
import Preloader from "../design-system/Preloader";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageWrapper({ children, pattern }) {
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen flex flex-col light-grid-bg text-[var(--color-text-primary)]"
      style={{ backgroundColor: "var(--color-bg-deep)" }}
    >
      {pathname === "/" && <Preloader />}
      <NodeNetworkBackground />
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex-grow pt-24 md:pt-28 pb-12 w-full overflow-x-hidden relative z-10"
      >
        {children}
      </motion.div>

      <Footer />
    </div>
  );
}
