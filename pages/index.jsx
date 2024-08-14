import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [question, setQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState("");
  const [solution, setSolution] = useState("");
  const [solutionImage, setSolutionImage] = useState("");
  const [ans, setAns] = useState("");

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
      question: question,
      questionImage: questionImage,
      solution: solution,
      solutionImage: solutionImage,
      ans: ans,
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
        console.log('done');
      } else {
        alert("Do it again!! 🥹");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }

    setQuestion("");
    setQuestionImage("");
    setSolution("");
    setSolutionImage("");
    setAns("");
  };

  return (
    <>
      <center className="flex flex-col px-10">
        <textarea
          name="question"
          placeholder="Question"
          rows={10}
          cols={10}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          id="g"
          className="text-black mt-4 text-3xl"
        ></textarea>
        <input
          type="text"
          placeholder="Answer"
          value={ans}
          className="text-black self-center h-10 border-2 mt-2 border-yellow-300"
          onChange={(e) => setAns(e.target.value)}
        />
        <div className="flex my-2 flex-row-reverse self-center gap-2 ">
          <input
            type="file"
            name="questionImage"
            id="questionImage"
            onChange={(e) => handleFileChange(e, setQuestionImage)}
          />
          <p className="text-2xl font-bold text-red-400">Question Image</p>
        </div>
        <div className=" my-2 flex flex-row-reverse self-center gap-2 ">
          <input
            type="file"
            name="solutionImage"
            id="solutionImage"
            onChange={(e) => handleFileChange(e, setSolutionImage)}
          />
          <p className="text-2xl font-bold text-red-400">Full Image</p>
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
        {solutionImage && (
          <div className="mt-4">
            <h3>Solution Image:</h3>
            <img
              src={solutionImage}
              alt="Solution"
              className="mt-2"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
      </center>
    </>
  );
}
