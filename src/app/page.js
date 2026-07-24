"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docText, setDocText] = useState("");
  const [docName, setDocName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = function (event) {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onend = function () {
        setIsRecording(false);
      };

      recognition.onerror = function () {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please upload a PDF smaller than 10MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.text) {
        setDocText(data.text);
        setDocName(file.name);
        setMessages(function (prev) {
          return prev.concat([
            {
              role: "assistant",
              type: "text",
              content: "Document uploaded successfully! Ab aap is document ke bare mein kuch bhi pooch saktay hain.",
            },
          ]);
        });
      }
    } catch (error) {
      setMessages(function (prev) {
        return prev.concat([{ role: "assistant", type: "text", content: "Document upload failed. Try again." }]);
      });
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = () => {
    setDocText("");
    setDocName("");
  };

  const generateImage = async (prompt) => {
    const userMessage = { role: "user", type: "text", content: prompt };
    const newMessages = messages.concat([userMessage]);
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await res.json();

      if (data.imageUrl) {
        setMessages(newMessages.concat([{ role: "assistant", type: "image", content: data.imageUrl }]));
      } else {
        setMessages(newMessages.concat([{ role: "assistant", type: "text", content: data.error || "Image generation failed." }]));
      }
    } catch (error) {
      setMessages(newMessages.concat([{ role: "assistant", type: "text", content: "Error generating image." }]));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (imageMode) {
      generateImage(input);
      return;
    }

    const userMessage = { role: "user", type: "text", content: input };
    const newMessages = messages.concat([userMessage]);
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      let messagesToSend = newMessages;
      if (docText) {
        const contextMessage = {
          role: "user",
          content: "Yahan ek document ka content hai, isko context ke tor pe use karo:\n\n" + docText + "\n\n---\n\nAb ye sawal answer karo: " + input,
        };
        messagesToSend = newMessages.slice(0, -1).concat([contextMessage]);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToSend.map(function (m) {
            return { role: m.role, content: m.content };
          }),
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages(newMessages.concat([{ role: "assistant", type: "text", content: data.reply }]));
      } else {
        setMessages(newMessages.concat([{ role: "assistant", type: "text", content: "Sorry, something went wrong." }]));
      }
    } catch (error) {
      setMessages(newMessages.concat([{ role: "assistant", type: "text", content: "Error connecting to server." }]));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
          <div>
            <h1 className="text-slate-800 font-bold text-lg leading-tight">Cortexa</h1>
            <p className="text-slate-400 text-xs">Powered by Gemini</p>
          </div>
        </div>
        {docName && (
          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-200">
            <span>{docName}</span>
            <button onClick={removeDocument} className="text-indigo-400 hover:text-red-500 font-bold ml-1">
              X
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-2">
            <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center text-2xl mb-2">
              💬
            </div>
            <p className="font-medium text-slate-500">Start a conversation</p>
            <p className="text-sm">Type a message, upload a document, or generate an image</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.type === "image" ? (
              <div className="max-w-xs rounded-2xl overflow-hidden shadow-md bg-white p-2 border border-slate-200">
                <img src={msg.content} alt="Generated" className="rounded-xl w-full h-auto" />
              </div>
            ) : (
              <div
                className={
                  "max-w-[75%] px-4 py-3 rounded-2xl whitespace-pre-wrap text-[15px] leading-relaxed shadow-sm " +
                  (msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white text-slate-700 rounded-bl-md border border-slate-200")
                }
              >
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-400 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-200 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </span>
              <span className="text-sm">{imageMode ? "Generating image..." : "Thinking..."}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition disabled:opacity-50 shrink-0"
            title="Upload PDF"
          >
            {uploading ? (
              <span className="text-xs">...</span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
              </svg>
            )}
          </button>

          <button
            onClick={toggleRecording}
            className={
              "w-11 h-11 flex items-center justify-center rounded-xl transition shrink-0 " +
              (isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 hover:bg-slate-200 text-slate-600")
            }
            title="Voice input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"></path>
              <path d="M19 10v2a7 7 0 01-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>

          <button
            onClick={() => setImageMode(!imageMode)}
            className={
              "w-11 h-11 flex items-center justify-center rounded-xl transition shrink-0 " +
              (imageMode ? "bg-purple-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600")
            }
            title="Toggle image generation mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <path d="M21 15l-5-5L5 21"></path>
            </svg>
          </button>

          <textarea
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-[15px] bg-slate-50"
            rows={1}
            placeholder={imageMode ? "Describe the image you want..." : isRecording ? "Listening..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition disabled:opacity-50 shrink-0"
          >
            Send
          </button>
        </div>

        {imageMode && (
          <p className="max-w-3xl mx-auto mt-2 text-xs text-purple-600 font-medium">
            Image mode is ON — your next message will generate an image
          </p>
        )}
      </div>
    </div>
  );
}