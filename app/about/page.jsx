import { Layout } from "@/components/Layout";

// app/about/page.tsx (App Router)
export default function AboutPage() {
  return (
    <Layout>
      <main className="min-h-screen text-gray-900">
        <section className="max-w-4xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-700 drop-shadow-sm">
              About Cirqle
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Helping you track job applications and find the best career fit.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-green-700">
              Our Mission
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed bg-green-50 border border-green-100 rounded-xl p-4 shadow-sm">
              At Cirqle, we believe job hunting should be organized,
              stress-free, and empowering. Our platform helps you track your
              applications, collaborate with friends, and use AI-powered resume
              matching to land the right opportunity faster.
            </p>
          </div>

          {/* Story */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-green-700">Our Story</h2>
            <p className="mt-4 text-gray-700 leading-relaxed bg-green-50  border border-green-100 rounded-xl p-4 shadow-sm">
              Cirqle was founded in 2024 as a personal project to simplify the
              job application process. What started as a tool for friends has
              grown into a platform designed for everyone navigating their
              career journey.
            </p>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-green-700">
              Key Features
            </h2>
            <ul className="mt-4 space-y-3">
              {[
                "Track job applications in one place",
                "Share progress with friends",
                "AI-powered resume matching with job descriptions",
                "Secure and simple to use",
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start bg-green-50 border border-lime-400 rounded-lg px-4 py-2"
                >
                  <span className="text-lime-600 text-xl mr-3">✅</span>
                  <span className="text-gray-900">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Creator */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-green-700">
              Meet the Creator
            </h2>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center bg-green-50 border border-green-100 rounded-xl p-4 shadow-sm">
              <img
                src="/profile.JPG"
                alt="Het Patel"
                className="w-28 h-28 rounded-full shadow-lg mb-4 sm:mb-0 sm:mr-6 border-4 border-emerald-500 object-cover aspect-square"
              />
              <p className="text-gray-900 leading-relaxed text-center sm:text-left">
                Cirqle was created by{" "}
                <span className="font-semibold text-green-700">Het Patel</span>,
                a Master’s student in Computer Science at UC Irvine, with a
                passion for building tools that bring ease and clarity to
                everyday challenges.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <a
              href="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition font-bold border-2 border-green-600"
            >
              Get Started
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
