import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [questionImage, setQuestionImage] = useState("");
  const [ans, setAns] = useState("");
  const [grade, setGrade] = useState("11th");
  const [chapter, setChapter] = useState("1");
  const [solution, setSolution] = useState(""); // Added state for solution

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setQuestionImage(reader.result);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleFileChange = (event, setImage) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const data = {
      questionImage: questionImage,
      solution: solution,
      ans: ans,
      grade: grade,
      chapter: chapter,
    };

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status === 201) {
        console.log("done");
      } else {
        alert("Do it again!! 🥹");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }

    setQuestionImage("");
    setSolution("");
    setAns("");
    setGrade("11th");
    setChapter("1");
  };

  return (
    <>
      <center className="flex flex-col px-10 mt-10">
        <p className="text-3xl text-white font-bold mb-3">paste images functionality is working </p>
        <input
          type="text"
          placeholder="Answer"
          value={ans}
          className="text-black self-center h-10 border-2 mt-2 border-yellow-300"
          onChange={(e) => setAns(e.target.value)}
        />

        <div className="my-2">
          <label htmlFor="grade" className="text-xl font-bold">Grade:</label>
          <select
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="text-black border-2 border-yellow-300 mt-2 w-60 px-3 ml-2"
          >
            <option value="11th">11th</option>
            <option value="12th">12th</option>
          </select>
        </div>

        <div className="my-2">
          <label htmlFor="chapter" className="text-xl font-bold">Chapter:</label>
          <select
            id="chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="text-black border-2 border-yellow-300 mt-2 w-60 px-3 ml-2"
          >
            {[...Array(16).keys()].map(i => (
              <option key={i} value={i + 1} className="w-60">{i + 1}</option>
            ))}
          </select>
        </div>

        <div className="flex my-2 flex-row-reverse self-center gap-2 ">
          <input
            type="file"
            name="questionImage"
            id="questionImage"
            onChange={(e) => handleFileChange(e, setQuestionImage)}
          />
          <p className="text-2xl font-bold text-red-400">Question Image</p>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-red-500 w-fit p-3 px-10 active:scale-95 transition-all duration-100 self-center"
        >
          Submit
        </button>
        
        {questionImage && (
          <div className="mt-4">
            <h3>Question Image:</h3>
            <img
              src={questionImage}
              alt="Question"
              className="mt-2"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
      </center>
    </>
  );
}
