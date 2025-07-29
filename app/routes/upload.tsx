import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdfToimage";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "ResuChekr | Upload" },
  { name: "description", content: "Upload PDF" },
];

const Upload = () => {

  //puter store imports
  const {auth, isLoading, fs, ai, kv} = usePuterStore(); //fs stands for file storage. kv stands for key value pairs storage

  //navigate
  const navigate = useNavigate();


  //states -  START
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  //functions - START

  //Resume upload analysis function matched against company name, title, description
  const handleAnalyse = async ({
    file,
    companyName,
    jobDescription,
    jobTitle,
  }: {
    companyName: string;
    jobDescription: string;
    jobTitle: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText('Uploading the file. Please wait....');
    const uploadedFile = await fs.upload([file]);
    if(!uploadedFile) return setStatusText("Error: Failed to upload file. Please try again....")
      setStatusText('Converting to image. Hold on...');
    const imageFile = await convertPdfToImage(file)
  };

  //submitting the response for analysis function
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form"); //getting form data w/o relying on the state
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) return; //if no file is uploaded, simply return
    handleAnalyse({ file, companyName, jobDescription, jobTitle });
    console.log({
      file,
      companyName,
      jobDescription,
      jobTitle,
    });
  };
  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Smart Feedback</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your Resume for ATS score & Improvement tips</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  name="company-name"
                  id="company-name"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  placeholder="Job title"
                  name="job-title"
                  id="job-title"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={6}
                  placeholder="Job Description"
                  name="job-description"
                  id="job-description"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
                Start Analysis
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
