export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-gray-950 px-4">
      <div className="relative w-full max-w-md">
        {/* Decorative circle */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-emerald-400 opacity-20 rounded-full blur-2xl z-0"></div>
        <div className="relative z-10 w-full bg-white bg-gray-900 border border-green-100 border-gray-800 rounded-3xl shadow-2xl p-10 text-center transition-colors">
          <h1 className="text-3xl font-extrabold mb-6 text-green-700 text-emerald-400 drop-shadow-lg tracking-tight">
            Check your email
          </h1>
          <p className="text-gray-900 text-gray-100 text-opacity-80 text-base">
            We've sent you a confirmation link.
            <br />
            Please verify your email to complete the signup process.
          </p>
        </div>
      </div>
    </div>
  );
}
