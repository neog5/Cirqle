"use client";
export const dynamic = "force-dynamic";

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
      return;
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
        redirectTo: `${window.location.origin}/dashboard`,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="relative w-full max-w-md">
        {/* Decorative circle */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-lime-400 opacity-20 rounded-full blur-2xl z-0"></div>
        <form
          onSubmit={handleSignup}
          className="relative z-10 w-full bg-white border border-green-100 rounded-3xl shadow-2xl p-10 space-y-7 transition-colors"
        >
          <h1 className="text-4xl font-extrabold mb-8 text-center text-green-700 drop-shadow-lg tracking-tight">
            Sign Up to <span className="text-green-600">Cirqle</span>
          </h1>

          {errorMsg && (
            <div className="bg-red-100 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label
              className="block text-green-700 font-semibold"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-4 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-green-700 font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-4 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-green-700 font-semibold"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-green-200 focus:border-green-600 rounded-lg px-4 py-2 bg-green-50 focus:bg-white outline-none transition text-gray-900"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg transition-all duration-200"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-green-200 hover:border-green-600 text-lime-600 font-semibold py-2.5 px-4 rounded-lg shadow transition-all duration-200 mt-2"
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
          <div className="text-center text-sm text-green-700 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="underline hover:text-lime-600 font-semibold"
            >
              Login here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
