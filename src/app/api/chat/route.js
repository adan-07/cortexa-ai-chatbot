import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

let historyMessages = messages.slice(0, -1);

// Remove any leading assistant/model messages (like upload confirmations)
// so history always starts with a "user" message
while (historyMessages.length > 0 && historyMessages[0].role !== "user") {
  historyMessages = historyMessages.slice(1);
}

const history = historyMessages.map((msg) => ({
  role: msg.role === "user" ? "user" : "model",
  parts: [{ text: msg.content }],
}));
    const chat = model.startChat({ history });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}