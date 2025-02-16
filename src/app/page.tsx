"use client"; // Ensures client-side rendering

import Spline from "@splinetool/react-spline";
import { useState, useCallback } from "react";
import {
  FaBars as Bars3Icon,
  FaTimes as XMarkIcon,
  FaUpload,
  FaMagic,
  FaShare,
  FaArrowRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Image from "next/image"; // Adjust the path as necessary

// Voice Playback
const speakText = (text: string) => {
  if (!text) return;
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Speech Synthesis is not supported in this browser.");
  }
};

// Upload Button Component
const UploadButton = ({ selectedFile, isLoading, handleUpload }) => {
  return (
    <motion.button
      whileHover={{ scale: selectedFile && !isLoading ? 1.05 : 1 }}
      whileTap={{ scale: selectedFile && !isLoading ? 0.95 : 1 }}
      onClick={() => selectedFile && handleUpload(selectedFile)}
      disabled={!selectedFile || isLoading}
      className={`mt-8 w-full py-3 rounded-lg transition-all duration-300 ${
        !selectedFile || isLoading
          ? "bg-gray-600 cursor-not-allowed text-gray-400"
          : "bg-emerald-500 hover:bg-emerald-600 text-white"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200" />
        </div>
      ) : (
        "Process Document"
      )}
    </motion.button>
  );
};

export default function Home() {
  // Navigation state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Upload & processing state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Additional interactive state
  const [selectedLanguage, setSelectedLanguage] = useState("eng");
  const [history, setHistory] = useState<Array<{ text: string; date: string }>>(
    []
  );
  const [showTutorial, setShowTutorial] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [currentStep, setCurrentStep] = useState(2); // For future step-based UI

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Navigation links
  const navLinks = [
    { name: "Home", href: "#hero", icon: "🏠" },
    { name: "Features", href: "#features", icon: "✨" },
    { name: "How It Works", href: "#process", icon: "⚙️" },
    { name: "Contact", href: "#contact", icon: "📧" },
  ];

  // Export recognized text as .txt or .pdf
  const handleExport = (format: string) => {
    const blob = new Blob([recognizedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document.${format}`;
    a.click();
  };

  // Share functionality using the Web Share API
  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Converted Document",
        text: recognizedText.substring(0, 100) + "...",
        url: window.location.href,
      });
    } catch (err) {
      console.error("Sharing failed:", err);
    }
  };

  // Dropzone setup for file uploads
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      // Create real-time preview if image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewImage("");
      }
      handleUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
  });

  // Upload handler: now calls the Flask API endpoint
  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Using Flask integration endpoint
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }
      const data = await res.json();
      // Assuming Flask returns { result: ... }
      setRecognizedText(String(data.result));
      // Save to history (keep only last 5 entries)
      setHistory((prev) => [
        ...prev.slice(-4),
        { text: String(data.result), date: new Date().toLocaleString() },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Processing error. Please try again."
      );
      setTimeout(() => setError(""), 5000);
    }
    setIsLoading(false);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* 3D Spline Background */}
      <div className="fixed inset-0 -z-10 opacity-80">
        <Spline
          scene="https://prod.spline.design/WSiNZaOmjvOiK5BI/scene.splinecode"
          onMouseMove={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </div>

      {/* Glowing Cursor Effect */}
      <div
        className={`pointer-events-none fixed inset-0 z-10 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-transparent blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-md border-b border-emerald-400/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <span className="text-emerald-400 text-xl font-semibold tracking-tight">
              QUANT
            </span>
          </motion.div>

          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-emerald-100 hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-400/10"
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-emerald-400"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          <button onClick={toggleTheme} className="text-emerald-400">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-800 p-4 space-y-4"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-emerald-100 hover:text-emerald-400 transition-all"
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="relative z-20 pt-24">
        <section id="hero" className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-emerald-400/20 p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-emerald-400 mb-2">
                QUANT <span className="text-emerald-200 text-xl ml-2"></span>
              </h1>
              <div className="w-12 h-1 bg-emerald-400 rounded-full" />
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-emerald-400 text-2xl font-bold"></span>
              <div className="h-px w-8 bg-emerald-400/30" />
            </div>

            {/* Content Section */}
            <motion.div
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="space-y-6 optimized-animation"
            >
              {/* Title */}
              <h1 className="text-3xl font-bold text-emerald-400 mb-4 text-center">
                Transform Handwriting to Digital Text
              </h1>
              <p className="text-lg text-emerald-200 mb-6 text-center">
                Upload your handwritten document to get instant transcription.
              </p>

              {/* Language Selection */}
              <div className="flex items-center justify-center gap-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-800/40 text-emerald-200 rounded-lg px-3 py-2 border border-emerald-400/20"
                >
                  <option value="eng">English</option>
                  <option value="spa">Spanish</option>
                  <option value="fra">French</option>
                  <option value="deu">German</option>
                </select>
              </div>

              {/* Upload Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer mt-8 ${
                  isDragActive
                    ? "border-emerald-400 bg-emerald-400/10"
                    : "border-gray-600 hover:border-emerald-400"
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <FaUpload className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-sm text-emerald-200">
                    {isDragActive
                      ? "Drop your file here!"
                      : "Drag & drop or click to upload"}
                  </p>
                </div>
              </div>

              {/* Real-Time Preview */}
              <AnimatePresence>
                {previewImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-8 relative group"
                  >
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={600}
                      height={400}
                      className="rounded-lg border border-emerald-400/20 max-h-64 object-contain"
                      priority
                      onLoadingComplete={() => console.log("Image loaded")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex items-end p-4">
                      <span className="text-base text-emerald-400">
                        Uploaded Preview
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 flex items-center justify-center space-x-2"
                  >
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-100" />
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-200" />
                    <span className="text-emerald-400 text-base">
                      Analyzing document...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Editable Recognized Text + Tools */}
              <AnimatePresence>
                {recognizedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 space-y-3"
                  >
                    <textarea
                      value={recognizedText}
                      onChange={(e) => setRecognizedText(e.target.value)}
                      rows={5}
                      className="w-full p-3 text-sm text-emerald-200 bg-gray-800/40 border border-emerald-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRecognizedText("")}
                        className="px-4 py-2 text-sm bg-red-400/20 text-red-400 rounded-lg hover:bg-red-400/30"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(recognizedText)
                        }
                        className="px-4 py-2 text-sm bg-emerald-400/20 text-emerald-400 rounded-lg hover:bg-emerald-400/30"
                      >
                        Copy All
                      </button>
                      <button
                        onClick={() => speakText(recognizedText)}
                        className="px-4 py-2 text-sm bg-blue-400/20 text-blue-400 rounded-lg hover:bg-blue-400/30 flex items-center gap-2"
                      >
                        <FaArrowRight className="w-4 h-4" />
                        Speak
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* File Format Conversion */}
              {recognizedText && (
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleExport("txt")}
                    className="text-xs px-3 py-2 bg-gray-700/40 text-emerald-300 rounded hover:bg-gray-600/50"
                  >
                    Export TXT
                  </button>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="text-xs px-3 py-2 bg-gray-700/40 text-emerald-300 rounded hover:bg-gray-600/50"
                  >
                    Export PDF
                  </button>
                </div>
              )}

              {/* Document History */}
              {history.length > 0 && (
                <div className="mt-8 bg-gray-900/60 p-5 rounded-lg border border-emerald-400/15">
                  <h3 className="text-emerald-400 text-base font-medium mb-3">
                    Recent Conversions
                  </h3>
                  <div className="space-y-2">
                    {history.map((entry, i) => (
                      <div
                        key={i}
                        className="text-sm text-emerald-200/80 p-2 bg-gray-800/30 rounded"
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate">
                            {entry.text.substring(0, 40)}...
                          </span>
                          <span className="text-xs text-emerald-400/60">
                            {entry.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Tutorial */}
              <AnimatePresence>
                {showTutorial && (
                  <motion.div
                    className="fixed bottom-6 right-6 bg-gray-800/90 p-4 rounded-lg border border-emerald-400/20 shadow-xl max-w-xs z-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-emerald-400 text-sm font-medium">
                        Quick Guide
                      </h3>
                      <button
                        onClick={() => setShowTutorial(false)}
                        className="text-emerald-400/60 hover:text-emerald-400 text-lg"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="space-y-2 text-emerald-200/80 text-sm">
                      <p>1. Upload a handwritten document or image.</p>
                      <p>2. Wait for AI processing (10-15 sec).</p>
                      <p>3. Edit, copy, speak, or export your text.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collaboration: Share Button */}
              {recognizedText && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 text-sm bg-blue-400/20 text-blue-400 rounded-lg hover:bg-blue-400/30 flex items-center gap-2"
                  >
                    <FaShare className="w-4 h-4" />
                    Share
                  </button>
                </div>
              )}

              {/* Improved Upload Button */}
              <UploadButton
                selectedFile={selectedFile}
                isLoading={isLoading}
                handleUpload={handleUpload}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto px-4 py-16 max-w-5xl"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {["AI Recognition", "Real-Time", "Multi-Format"].map(
              (feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-800/40 backdrop-blur-sm p-5 rounded-lg border border-emerald-400/15 hover:border-emerald-400/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-emerald-400/10 rounded-md flex items-center justify-center mb-3">
                    <FaMagic className="w-5 h-5 text-emerald-400 group-hover:animate-spin" />
                  </div>
                  <h3 className="text-xl font-medium text-emerald-300 mb-2">
                    {feature}
                  </h3>
                  <p className="text-sm text-emerald-200/80 leading-relaxed">
                    Advanced OCR with deep learning capabilities.
                  </p>
                </motion.div>
              )
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-400/10 mt-16 bg-gray-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-8 flex justify-between items-center">
          <div className="text-emerald-400/60">
            © {new Date().getFullYear()} QUANT
          </div>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-emerald-400/60 hover:text-emerald-400 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-emerald-400/60 hover:text-emerald-400 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-emerald-400/60 hover:text-emerald-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
