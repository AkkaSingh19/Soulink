"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/blog/api/signup/",
        formData
      );
      setSuccessMsg(data?.message || "Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl overflow-hidden border-slate-200 shadow-2xl">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0 h-full">

          {/* LEFT: Form section */}
          <div className="flex items-center justify-center">
            <form
              onSubmit={handleSignup}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 sm:p-8 shadow-xl"
              style={{ height: "100%" }}  
            >
              <div className="mb-6 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Create your Account
                </h1>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-4 pr-10 bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus-visible:ring-purple-600"
                    required
                  />
                  <User className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>

                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-4 pr-10 bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus-visible:ring-purple-600"
                    required
                  />
                  <Mail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>

                <div className="relative">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-4 pr-10 bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus-visible:ring-purple-600"
                    required
                  />
                  <Lock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>

              {errorMsg && (
                <p className="text-red-600 text-sm mt-4 text-center">{errorMsg}</p>
              )}
              {successMsg && (
                <p className="text-green-600 text-sm mt-4 text-center">{successMsg}</p>
              )}

              <Button
                type="submit"
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Sign Up
              </Button>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <a href="/signin" className="font-semibold text-purple-600 hover:underline">
                  Sign-in
                </a>
              </p>
            </form>
          </div>

           {/* RIGHT: panel with logo */}
          <div className="relative hidden rounded-2xl md:flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-10">
            <div className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-md p-6 ring-1 ring-white/20 shadow-2xl">
            <img
              src="/image/soulink-logo.png"
              alt="Soulink Logo"
              className="w-52 sm:w-64 lg:w-72 h-auto drop-shadow-lg"
            />
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
