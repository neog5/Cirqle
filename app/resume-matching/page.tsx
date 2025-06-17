import ResumeMatcher from "@/components/ResumeMatcher";
import { Layout } from "@/components/Layout";

export default function ResumeMatchingPage() {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 tracking-tight">
          Resume Matching
        </h1>
      </div>
      <ResumeMatcher />
    </Layout>
  );
}
