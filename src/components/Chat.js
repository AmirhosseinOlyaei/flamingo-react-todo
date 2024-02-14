import { useState } from "react";
import axios from "axios";
import style from "./Chat.module.css";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState([]);
  const API_KEY = process.env.REACT_APP_API_KEY;

  const sendMessage = async () => {
    // Add the user's message to the response state before making the API call
    const userMessage = { type: "user", message: message };
    setResponse((prev) => [...prev, userMessage]);

    const apiEndpoint = "https://api.openai.com/v1/chat/completions";
    const apiHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };
    const requestBody = {
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    };

    try {
      const apiResponse = await axios.post(apiEndpoint, requestBody, {
        headers: apiHeaders,
      });
      const responseMessage = apiResponse.data.choices[0].message.content;
      // Correctly update the state by adding a new response object to the existing array
      setResponse((prevResponses) => [
        ...prevResponses,
        { type: "AI", message: responseMessage },
      ]);
      setMessage(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <section>
      <div className={`${style.container} ${style.noBulletPoints}`}>
        {response.map((res, index) => (
          <div
            key={index}
            className={res.type === "AI" ? style.aiResponse : style.userMessage}
          >
            {res.type === "AI" ? (
              <ReactMarkdown children={res.message} />
            ) : (
              res.message
            )}
          </div>
        ))}
      </div>
      <div className={style.inputContainer}>
        <div className={style.note}>
          <input
            className={style.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button onClick={sendMessage} className={style.button}>
            Send
          </button>
        </div>
        <div className={style.spanStyle}>
          E.g. Generate tasks for the upcoming practicum on React Full Stack MVP
          and scope ideas for my to-do list.
        </div>
      </div>
    </section>
  );
};

export default Chat;
