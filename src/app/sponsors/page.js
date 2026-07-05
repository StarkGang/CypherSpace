"use client";
import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import Sponsors from "../../components/home/Sponsors";
import { api } from "../../lib/api";

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data?.data?.sponsors) {
          setSponsors(res.data.data.sponsors);
        }
      } catch (err) {
        console.error("Failed to load sponsors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <PageWrapper>
      <div className="min-h-[70vh]">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-t-[#2563eb] border-r-transparent border-b-[#2563eb] border-l-transparent animate-spin" />
          </div>
        ) : (
          <Sponsors sponsors={sponsors} />
        )}
      </div>
    </PageWrapper>
  );
}
