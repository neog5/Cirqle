export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-white px-4">
      <div className="relative w-full max-w-md">
        {/* Decorative circle */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-green-300 opacity-30 rounded-full blur-2xl z-0"></div>
        <div className="relative z-10 w-full bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-green-100 text-center">
          <h1 className="text-3xl font-extrabold mb-6 text-green-700 drop-shadow-lg tracking-tight">
            Check your email
          </h1>
          <p className="text-green-900 text-opacity-80 text-base">
            We've sent you a confirmation link.
            <br />
            Please verify your email to complete the signup process.
          </p>
        </div>
      </div>
    </div>
  );
}
