"use client";

import React, { useState } from "react";
import { useAuth } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import PageWrapper from "../../../components/layout/PageWrapper";
import Paper from "../../../components/design-system/Paper";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Sticker from "../../../components/design-system/Sticker";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper pattern="grid">
      <div className="container mx-auto max-w-lg px-4 py-20 flex justify-center items-center min-h-[70vh]">
        <Paper className="w-full relative p-8 md:p-12" rotate={1} shadowSize="lg">
          
          <div className="absolute -top-6 -right-6 z-10">
            <Sticker color="lime" size="md" rotate={15}>ADMIN</Sticker>
          </div>

          <div className="text-center mb-10">
            <h1 className="font-display font-black text-4xl uppercase mb-2">Backstage</h1>
            <p className="font-mono text-sm font-bold text-gray-500 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider mt-2">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} fullWidth className="mt-4">
              {loading ? "Authenticating..." : "Access Mainframe"}
            </Button>
          </form>

        </Paper>
      </div>
    </PageWrapper>
  );
}
