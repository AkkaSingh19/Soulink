"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/blog/api/signup/", formData);
      setSuccessMsg("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/image/background.jpg')" }}
    >
      <form
        onSubmit={handleSignup}
        className="w-full max-w-[420px] mx-4 sm:mx-6 bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-6 sm:p-8 text-white"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">Sign Up</h1>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="pl-5 pr-10 text-white placeholder-white bg-transparent border-white/20"
              required
            />
            <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
          </div>

          <div className="relative">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="pl-5 pr-10 text-white placeholder-white bg-transparent border-white/20"
              required
            />
            <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
          </div>

          <div className="relative">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="pl-5 pr-10 text-white placeholder-white bg-transparent border-white/20"
              required
            />
            <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
          </div>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm mt-4 text-center">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-500 text-sm mt-4 text-center">{successMsg}</p>
        )}

        <Button type="submit" className="w-full mt-6">
          Submit
        </Button>

        <div className="text-center text-sm mt-6">
          <p>
            Already have an account?{" "}
            <a href="/signin" className="font-semibold hover:underline">
              Sign-in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
