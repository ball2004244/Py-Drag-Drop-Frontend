"use client";
import { sendCode } from "../apis";
import { useState } from "react";

export default function EditorPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const bracketsMap: { [key: string]: string } = {
    "(": ")",
    "{": "}",
    "[": "]",
    "'": "'",
    '"': '"',
  };

  const handleSendCode = async (code: string) => {
    try {
        if (!code) throw new Error("Code is empty");
        const json_code = JSON.parse(code);

        const data = { code: json_code };

        const response = await sendCode(data);

        setStatus(response.status);
        setStdout(response.stdout);
        setStderr(response.stderr);

    } catch (err: Error | any) {
        setStatus("Frontend Error");
        setStdout(err.message);
    }
  };
  
  const outputFormatter = (output: string) => {
    // process \n
    const lines = output.split("\n");
    const formattedOutput = lines.map((line, index) => {
      return (
        <span key={index}>
          {line}
          <br />
        </span>
      );
    });


    return formattedOutput;
  }

// TODO: Replace textara with WYSIWYG library
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="title flex flex-col items-center justify-center py-4 my-10 min-h-2/3 w-10/12">
        <h1 className="text-5xl font-bold text-center">Code Editor</h1>
        <div className="flex items-center justify-center gap-2 flex-col lg:flex-row w-full py-6">
          <textarea
            className="code-area text-2xl font-light my-10 w-full items-center justify-center resize-none lg:min-h-[32rem] lg:h-full h-[20rem] p-4 border-1 border-xl border-gray-300 rounded-xl dark:bg-zinc-800 outline-none overflow-auto"
            placeholder="Write your code in Python here..."
            onChange={(e) => setCode(e.target.value)}
            value={code}
          />
          <div className="console flex flex-col gap-2 flex-row bg-black dark:bg-gray-800 rounded-xl w-full lg:min-h-[32rem] h-[14rem] p-6 wrap overflow-auto">
            <h2 className="text-2xl text-white mb-2 font-bold">Console</h2>
            <h3 className="text-xl text-white m-1"><span className="font-semibold">Status:</span> {status}</h3>
            <h3 className="text-xl text-white m-1"><span className="font-semibold">Stdout:</span> {outputFormatter(stdout)}</h3>
            <h3 className="text-xl text-white m-1"><span className="font-semibold">Stderr:</span> {outputFormatter(stderr)}</h3>
          </div>
        </div>
        <button
          className="bg-gradient-to-r from-zinc-500 to-zinc-600 hover:from-zinc-600 hover:to-zinc-700 text-white font-bold py-2 px-4 rounded min-w-[10rem] max-w-[16rem] w-full select-none outline-none"
          onClick={() => handleSendCode(code)}
        >
          Compile
        </button>
      </div>
    </main>
  );
}