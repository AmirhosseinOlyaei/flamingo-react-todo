import { useState } from "react";
import axios from "axios";
import styles from "./TodoListItem.module.css";
import style from "./TaskGeneration.module.css";
import ReactMarkdown from "react-markdown";
import loadingSpinner from "../image_processing.gif";

const TaskGeneration = () => {
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.REACT_APP_API_KEY;

  const generateTasks = async () => {
    setGeneratedTasks([]);

    setLoading(true);

    const prompt =
      "Generate 5 creative and engaging tasks for a todo list application.";
    const apiEndpoint = "https://api.openai.com/v1/chat/completions";
    const apiHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };
    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    };

    try {
      const response = await axios.post(apiEndpoint, requestBody, {
        headers: apiHeaders,
      });
      const tasks = response.data.choices[0].message.content.split("\n");
      setGeneratedTasks(tasks.filter((task) => task.trim() !== ""));
    } catch (error) {
      console.error("Error generating tasks: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 className={style.h1Style}>
        Generate 5 creative and engaging tasks for a todo list application
      </h1>
      <hr />
      <br />
      <button onClick={generateTasks} className={styles.button}>
        Generate Tasks
      </button>
      {loading && (
        <img src={loadingSpinner} alt="Loading..." className={style.loader} />
      )}
      <div className={style.generatedListContainer}>
        {generatedTasks.map((task, index) => (
          // Treat each task as markdown content
          <ReactMarkdown
            key={index}
            children={task}
            className={style.taskItem}
          />
        ))}
      </div>
    </section>
  );
};

export default TaskGeneration;
