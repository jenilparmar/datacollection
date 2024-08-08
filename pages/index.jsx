import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [base64Image, setBase64Image] = useState("");
  const [question, setQuestion] = useState("");
const [ans , setans] = useState("")
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Image(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleSubmit = async () => {
    const data = {
      question: question,
      image: base64Image,
      ans:ans
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
        alert("Done! Share a new Question!!🫡");
      } else {
        alert("Do it again!! 🥹");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }




    setQuestion("");
    setBase64Image("")
    setans("")
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
        <input type="text" placeholder="answer" value={ans} className="text-black self-center h-10 border-2 mt-2 border-yellow-300" name=""  id="" onChange={(e)=>setans(e.target.value)} />
        <input type="file" name="image" id="k" onChange={handleFileChange} />
        <button onClick={handleSubmit} className="bg-red-500 w-fit p-3 px-10  active:scale-95 transition-all duration-100 self-center">Submit</button>
        {base64Image && (
          <div>
            <h3>Base64 Image:</h3>
            <textarea
              readOnly
              rows={10}
              cols={50}
              value={base64Image}
              className="text-black mt-4 text-3xl"
            ></textarea>
          </div>
        )}
      </center>
    </>
  );
}
