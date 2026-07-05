"use client";
import React, { useState, useEffect } from "react";
import LaunchScreen from "../design-system/LaunchScreen";

export default function LaunchProvider({ children, settings }) {
  
  const [unlocked, setUnlocked] = useState(true); 

  useEffect(() => {
    if (settings?.enable_launch_mode) {
      
      const hasUnlocked = sessionStorage.getItem("cypherspace_launched");
      if (!hasUnlocked) {
        setTimeout(() => setUnlocked(false), 0);
      }
    }
  }, [settings?.enable_launch_mode]);

  const handleUnlock = () => {
    sessionStorage.setItem("cypherspace_launched", "true");
    setUnlocked(true);
  };

  return (
    <>
      {!unlocked && settings?.enable_launch_mode && (
        <LaunchScreen 
          launchDate={settings?.launch_date} 
          launchAction={settings?.launch_action || "hold"}
          onUnlock={handleUnlock}
        />
      )}
      {children}
    </>
  );
}
