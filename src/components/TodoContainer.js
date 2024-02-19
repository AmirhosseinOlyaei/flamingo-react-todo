import axios from "axios";
import { useState, useEffect, useCallback, useContext } from "react";
import { TodoCounterContext } from "../context/todoCounterContext";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";
import styles from "./TodoListItem.module.css";

function TodoContainer() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { count, setCount } = useContext(TodoCounterContext);
  const [completionMessage, setCompletionMessage] = useState("");
  const [completionMessageTimeout, setCompletionMessageTimeout] =
    useState(null);

  // const API_BASE_URL = "https://api.airtable.com/v0/";
  // const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;
  // const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;
  // const AIRTABLE_API_TOKEN = process.env.REACT_APP_AIRTABLE_API_TOKEN;
  // const SORT_BY_LAST_MODIFIED_TIME =
  //   "?sort[0][field]=completed&sort[0][direction]=asc&sort[1][field]=lastModifiedTime&sort[1][direction]=asc";
  // const URL = `${API_BASE_URL}${AIRTABLE_BASE_ID}/${TABLE_NAME}`;
  // const SORT_BY_TITLE = "?sort[0][field]=Title&sort[0][direction]=asc";

  // Add cache state
  // const [cache, setCache] = useState({ data: null, timestamp: null });
  // const cacheDuration = 5 * 60 * 1000; // Cache duration in milliseconds, e.g., 5 minutes

  const memoizedFetchData = useCallback(async () => {
    // const fetchData = async () => {
    // const now = new Date().getTime();
    // const fetchURL = `${URL}${SORT_BY_LAST_MODIFIED_TIME}`;
    // const fetchURL = `${URL}${SORT_BY_TITLE}`;
    // const fetchURL = `${URL}${SORT_BY_LAST_MODIFIED_TIME}&view=Grid%20view`;

    // Check if cache is valid
    // if (
    //   cache.data &&
    //   cache.timestamp &&
    //   now - cache.timestamp < cacheDuration
    // ) {
    //   return cache.data; // Return cached data if it's still fresh
    // }

    // Make API request if cache is not valid
    try {
      // const response = await axios.get(fetchURL, {
      //   headers: {
      //     Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      //   },
      // });
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/todos`
      ); // Pointing to Node.js server's endpoint

      const todos = response.data.records.map(
        ({ fields: { title, completed }, id }) => ({
          id,
          title,
          completed,
        })
      );
      // .sort((a, b) => a.title.localeCompare(b.title)); // For ascending order
      // .sort((a, b) => b.title.localeCompare(a.title)); // For descending order

      // Update cache with new data
      // setCache({ data: todos, timestamp: now });
      // return todos;
      setTodoList(todos);
    } catch (error) {
      // throw new Error(`Error fetching data: ${error.message}`);
      console.error("Error updating todo list: ", error);
      setCompletionMessage("Failed to fetch todos. Please try again.");
    } finally {
      setIsLoading(false);
    }
    // };

    // try {
    //   // setIsLoading(true);
    //   const todos = await fetchData();
    //   setCompletionMessage("");
    // } catch (error) {
    // }
  }, []);

  useEffect(() => {
    memoizedFetchData();
  }, [memoizedFetchData]);

  useEffect(() => {
    setCount(todoList.length);
  }, [todoList, setCount]);

  const addTodo = async (newTodo) => {
    const options = {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      },
    };

    try {
      const response = await axios.post(
        // URL,
        `${process.env.REACT_APP_API_URL}/api/todos`, // Pointing to Node.js server's endpoint
        { fields: { title: newTodo.title } },
        options
      );

      // Insert the new todo at the correct position in the list
      setTodoList((prevTodoList) => {
        const incompleteTodos = prevTodoList.filter((todo) => !todo.completed);
        const completeTodos = prevTodoList.filter((todo) => todo.completed);
        // const updatedTodoList = [...prevTodoList, newTodoObject];
        // return updatedTodoList.sort((a, b) => a.title.localeCompare(b.title));

        return [
          ...incompleteTodos,
          {
            id: response.data.id,
            title: response.data.fields.title,
            completed: false,
          },
          ...completeTodos,
        ];
      });

      // setCompletionMessage("Todo added successfully");
      const messageTimer = setTimeout(() => setCompletionMessage(""), 3000);
      setCompletionMessageTimeout(messageTimer); // Store the timeout ID
    } catch (error) {
      setCompletionMessage("Failed to add todo. Please try again.");
      const messageTimer = setTimeout(() => setCompletionMessage(""), 3000);
      return () => clearTimeout(messageTimer);
    }
  };
  useEffect(() => {
    // Cleanup function
    return () => {
      if (completionMessageTimeout) {
        clearTimeout(completionMessageTimeout); // Clear the timeout
      }
    };
  }, [completionMessageTimeout]); // Dependency array

  const deleteTodo = async (id) => {
    try {
      // const response = await axios.delete(`${URL}/${id}`, {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/todos/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Error deleting todo: ${error.message}`);
    }
  };

  const removeTodo = async (id) => {
    await deleteTodo(id);
    setTodoList(todoList.filter((todo) => todo.id !== id));
  };

  const updateTodo = async (todo) => {
    try {
      const airtableData = {
        fields: {
          completed: todo.completed,
        },
      };
      // const updateURL = `${URL}/${todo.id}${SORT_BY_LAST_MODIFIED_TIME}`;
      const updateURL = `${process.env.REACT_APP_API_URL}/api/todos/${todo.id}`; // Pointing to Node.js server's endpoint

      const response = await axios.patch(updateURL, airtableData, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error updating todo: ${error.message}`);
    }
  };

  const editTodo = async (id, newTitle) => {
    try {
      const airtableData = {
        fields: {
          title: newTitle,
        },
      };
      // const updateURL = `${URL}/${id}`;
      const updateURL = `${process.env.REACT_APP_API_URL}/api/todos/${id}`; // Pointing to Node.js server's endpoint
      await axios.patch(updateURL, airtableData, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
        },
      });

      setTodoList((prevList) =>
        prevList.map((todo) =>
          todo.id === id ? { ...todo, title: newTitle } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo", error);
    }
  };

  const onReorderTodo = (newTodoList) => {
    setTodoList(newTodoList);
  };

  const onToggleComplete = async (id, completed) => {
    const updatedTodoList = todoList.map((todo) =>
      todo.id === id ? { ...todo, completed } : todo
    );

    await updateTodo(updatedTodoList.find((itemTodo) => itemTodo.id === id));

    // Reorder the list immediately when an item is marked as complete
    const incompleteTodos = updatedTodoList.filter((todo) => !todo.completed);
    const completeTodos = updatedTodoList.filter((todo) => todo.completed);
    const reorderedTodoList = [...incompleteTodos, ...completeTodos];

    setTodoList(reorderedTodoList);
  };

  return (
    <section>
      <div className={styles.heading}>
        <h1>Todo List</h1>
        <span className={styles.spanStyle}>Item Counts: {count}</span>
      </div>
      <AddTodoForm onAddTodo={addTodo} />
      {completionMessage && <p>{completionMessage}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TodoList
          todoList={todoList}
          onRemoveTodo={removeTodo}
          onReorderTodo={onReorderTodo}
          onToggleComplete={onToggleComplete}
          onEditTodo={editTodo}
        />
      )}
    </section>
  );
}

export default TodoContainer;
