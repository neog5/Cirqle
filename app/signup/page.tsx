"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const isMatch = checkPasswordMatch(password, confirmPassword);
    if (!isMatch) {
      return; // Stop if passwords do not match
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/check-email");
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // Redirect after login
      },
    });
    if (error) setErrorMsg(error.message);
  };

  const checkPasswordMatch = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-gray-950 px-4">
      <div className="relative w-full max-w-md">
        {/* Decorative circle */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-emerald-400 opacity-20 rounded-full blur-2xl z-0"></div>
        <form
          onSubmit={handleSignup}
          className="relative z-10 w-full bg-white bg-gray-900 border border-green-100 border-gray-800 rounded-3xl shadow-2xl p-10 space-y-7 transition-colors"
        >
          <h1 className="text-4xl font-extrabold mb-8 text-center text-green-700 text-emerald-400 drop-shadow-lg tracking-tight">
            Sign Up to{" "}
            <span className="text-green-500 text-emerald-400">Cirqle</span>
          </h1>

          {errorMsg && (
            <div className="text-red-700 text-red-400 bg-red-100 bg-red-900/30 p-3 rounded-lg text-sm text-center border border-red-200 border-red-700">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label
              className="block text-green-900 text-emerald-400 font-semibold"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-green-200 border-emerald-700 focus:border-green-400 focus:border-emerald-400 rounded-lg px-4 py-2 bg-green-50 bg-gray-800 focus:bg-white focus:bg-gray-900 outline-none transition text-green-900 text-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-green-900 text-emerald-400 font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-green-200 border-emerald-700 focus:border-green-400 focus:border-emerald-400 rounded-lg px-4 py-2 bg-green-50 bg-gray-800 focus:bg-white focus:bg-gray-900 outline-none transition text-green-900 text-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-green-900 text-emerald-400 font-semibold"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-green-200 border-emerald-700 focus:border-green-400 focus:border-emerald-400 rounded-lg px-4 py-2 bg-green-50 bg-gray-800 focus:bg-white focus:bg-gray-900 outline-none transition text-green-900 text-gray-100"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 from-emerald-600 to-emerald-700 hover:from-green-600 hover:to-green-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg transition-all duration-200"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white bg-gray-900 border border-green-200 border-emerald-700 hover:border-green-400 hover:border-emerald-400 text-green-700 text-emerald-400 font-semibold py-2.5 px-4 rounded-lg shadow transition-all duration-200 mt-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <g>
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
              </g>
            </svg>
            Sign up with Google
          </button>
          <div className="text-center text-sm text-green-700 text-emerald-400 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="underline hover:text-green-900 hover:text-emerald-300 font-semibold"
            >
              Login here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
