"use client";

import React, { useState } from "react";
import { Input } from "../ui/input"; 
import { Button } from "../ui/button"; 
import { User, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SigninForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/blog/api/token/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);


      navigate("/dashboard");
    } catch (err: any) {
      setErrorMsg("Invalid username or password");
    }
  };

  return (
    <div
        className="w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/image/background.jpg')" }}
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-[420px] mx-4 sm:mx-6 bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-6 sm:p-8 text-white"
    >

        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">Sign-in</h1>


        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-5 pr-10 text-white placeholder-white bg-transparent border-white/20"
            />
            <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
          </div>

          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-5 pr-10 text-white placeholder-white bg-transparent border-white/20"
            />
            <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
          </div>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm mt-2 text-center">{errorMsg}</p>
        )}

        <Button type="submit" className="w-full mt-6">
          Login
        </Button>

        <div className="text-center text-sm mt-6">
          <p>
            Don’t have an account?{" "}
            <a href="/signup" className="font-semibold hover:underline">
              Sign-up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
