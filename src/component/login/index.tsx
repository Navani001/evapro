"use client";
import React, { useState } from "react";
import { ButtonComponent } from "../button";
import { Button, Input } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { MdMessage, MdBusiness, MdVisibility, MdVisibilityOff } from "react-icons/md";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    // Add login logic here
    signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirect
    }).then((response) => {
      if (response?.error) {
        console.error("Login failed:", response.error);
        setIsLoading(false);
      } else {
        // Handle successful login, e.g., redirect to dashboard
        window.location.href = "/dashboard"; // Adjust the redirect path as needed
      }
    });
    setTimeout(() => setIsLoading(false), 2000); // Simulate loading
  };

  return (
    <div className="w-[420px] bg-slate-50 rounded-2xl shadow-xl border-2 border-slate-200 p-8 font-medium">
      
      <div className="flex flex-col gap-6">
        {/* RCS Branding Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MdMessage className="text-3xl text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">RCS Platform</h1>
          </div>
          <p className="text-slate-600 text-sm font-medium">Brand Messaging Solutions</p>
        </div>

        {/* Welcome Message */}
        <div className="text-center border-b border-slate-200 pb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-slate-600 text-sm">Sign in to manage your RCS campaigns</p>
        </div>
        
        {/* Login Form */}
        <div className="space-y-4">
          <Input
            value={email}
            onValueChange={(val) => setEmail(val)}
            isRequired
            placeholder="Email address"
            size="lg"
            variant="bordered"
            classNames={{
              input: "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-black",
              label: "text-slate-700 font-medium",
            }}
             
           
          />
          <Input
            value={password}
            onValueChange={(val) => setPassword(val)}
            isRequired
            placeholder="Password"
            type={isPasswordVisible ? "text" : "password"}
            size="lg"
            variant="bordered"
            classNames={{
              input: "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-black",
              label: "text-slate-700 font-medium",
            }}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label="toggle password visibility"
              >
                {isPasswordVisible ? (
                  <MdVisibilityOff className="text-2xl text-slate-400 hover:text-slate-600 transition-colors pointer-events-none" />
                ) : (
                  <MdVisibility className="text-2xl text-slate-400 hover:text-slate-600 transition-colors pointer-events-none" />
                )}
              </button>
            }
          />
          
          <Button 
            onClick={handleLogin}
            isLoading={isLoading}
            className="w-full bg-indigo-600 text-white font-semibold py-6 text-base hover:bg-indigo-700 transition-colors rounded-xl"
            size="lg"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
        
        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-1 h-px bg-slate-300"></div>
          <span className="px-4 text-sm text-slate-500 font-medium">or</span>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>
        
        {/* Google Sign In */}
        <ButtonComponent
          buttonIcon={<FcGoogle size={20} />}
          handleOnClick={() => signIn("google", { redirectTo: "/" })}
          buttonText="Continue with Google"
          baseClassName="w-full border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
          textClassName="text-slate-700"
        />
        
        
        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600 font-medium">
            Need an account?{" "}
            <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer font-semibold">
              Contact Sales
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
