import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodoCounterContext } from "./context/todoCounterContext";
import LandingPage from "./LandingPage";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { count, setCount } = useContext(TodoCounterContext);
  const [completionMessage, setCompletionMessage] = useState("");
  const [completionMessageTimeout, setCompletionMessageTimeout] =
    useState(null);

  const API_BASE_URL = "https://api.airtable.com/v0/";
  const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;
  const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;
  const AIRTABLE_API_TOKEN = process.env.REACT_APP_AIRTABLE_API_TOKEN;
  const SORT_BY_LAST_MODIFIED_TIME =
    "?sort[0][field]=completed&sort[0][direction]=asc&sort[1][field]=lastModifiedTime&sort[1][direction]=asc";
  const URL = `${API_BASE_URL}${AIRTABLE_BASE_ID}/${TABLE_NAME}`;

  const fetchData = async () => {
    const fetchURL = `${URL}${SORT_BY_LAST_MODIFIED_TIME}`;

    try {
      const response = await axios.get(fetchURL, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
        },
      });

      const todos = response.data.records.map(
        ({ fields: { title, completed }, id }) => ({
          id,
          title,
          completed,
        })
      );

      return todos;
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  };

  const memoizedFetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const todo = await fetchData();
      setTodoList(todo);
      setCompletionMessage("");
    } catch (error) {
      console.error("Error updating todo list: ", error);
      setCompletionMessage("Failed to fetch todos. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    memoizedFetchData();
  }, [memoizedFetchData]);

  useEffect(() => {
    setCount(todoList.length);
  }, [todoList]);

  const updateTodo = async (todo) => {
    try {
      const airtableData = {
        fields: {
          completed: todo.completed,
        },
      };
      const updateURL = `${URL}/${todo.id}${SORT_BY_LAST_MODIFIED_TIME}`;
      const response = await axios.patch(updateURL, airtableData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error updating todo: ${error.message}`);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`${URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error deleting todo: ${error.message}`);
    }
  };

  const addTodo = async (newTodo) => {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
      },
    };

    try {
      const response = await axios.post(
        URL,
        { fields: { title: newTodo.title } },
        options
      );

      // Insert the new todo at the correct position in the list
      setTodoList((prevTodoList) => {
        const incompleteTodos = prevTodoList.filter((todo) => !todo.completed);
        const completeTodos = prevTodoList.filter((todo) => todo.completed);

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

  const removeTodo = async (id) => {
    await deleteTodo(id);
    setTodoList(todoList.filter((todo) => todo.id !== id));
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

  const editTodo = async (id, newTitle) => {
    try {
      const airtableData = {
        fields: {
          title: newTitle,
        },
      };
      const updateURL = `${URL}/${id}`;
      await axios.patch(updateURL, airtableData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AIRTABLE_API_TOKEN}`,
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <section>
              <h1>Todo List</h1>
              <AddTodoForm onAddTodo={addTodo} />
              {completionMessage && <p>{completionMessage}</p>}
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <span>Item Counts: {count}</span>
                  <TodoList
                    todoList={todoList}
                    onRemoveTodo={removeTodo}
                    onReorderTodo={onReorderTodo}
                    onToggleComplete={onToggleComplete}
                    onEditTodo={editTodo}
                  />
                </>
              )}
            </section>
          }
        />
        <Route path="/new" element={<h1>New Todo List</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
