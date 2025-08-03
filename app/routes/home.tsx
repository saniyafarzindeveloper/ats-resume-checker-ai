import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";

import type { Route } from "./+types/home";

import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuCheckr" },
    { name: "description", content: "AI powered resume reviewing platform" },
  ];
}

export default function Home() {
  //getting loading state from the puter store
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  //states
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResume, setLoadingResumes] = useState(false);

  //use effects
  //resume fetching
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      console.log(parsedResumes, "resumes");
      //setting parsed resume
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Reviews</h1>
          {!loadingResume && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback!</h2>
          ) : (
            <h2>Review your submission & get feedback backed by AI</h2>
          )}
        </div>
          {loadingResume && (
            <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" alt="resume scanner" className="w-[200px]" />
            </div>
          )}
        {!loadingResume && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!loadingResume && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to='/upload' className="primary-button w-fit text-2xl font-semibold ">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
