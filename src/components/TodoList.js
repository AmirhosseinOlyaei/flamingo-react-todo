// It removes the dragged item from its original position and inserts it at the target position.

import TodoListItem from "./TodoListItem";
import { useState } from "react";
import styles from "./TodoListItem.module.css";
import PropTypes from "prop-types";

const TodoList = ({
  todoList,
  onRemoveTodo,
  onReorderTodo,
  onToggleComplete,
  onEditTodo,
}) => {
  const [draggedTodoId, setDraggedTodoId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedTodoId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();

    if (draggedTodoId === targetId) {
      return;
    }

    const updatedTodoList = [...todoList];
    const draggedIndex = updatedTodoList.findIndex(
      (todo) => todo.id === draggedTodoId
    );
    const targetIndex = updatedTodoList.findIndex(
      (todo) => todo.id === targetId
    );

    const draggedItem = updatedTodoList[draggedIndex];
    updatedTodoList.splice(draggedIndex, 1); // Remove the dragged item
    updatedTodoList.splice(targetIndex, 0, draggedItem); // Insert the dragged item at the target position

    onReorderTodo(updatedTodoList);
    setDraggedTodoId(null);
  };

  return (
    <ul className={styles.noBulletPoints}>
      {todoList.map(({ id, ...rest }) => (
        <li
          className={`${styles.ListItem} ${styles.draggableItem}`}
          key={id}
          draggable
          onDragStart={(e) => {
            handleDragStart(e, id);
            e.currentTarget.classList.add(styles.dragging);
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove(styles.dragging);
          }}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, id)}
        >
          <TodoListItem
            todo={{ id, ...rest }}
            onRemoveTodo={onRemoveTodo}
            onToggleComplete={onToggleComplete}
            onEditTodo={onEditTodo}
          />
        </li>
      ))}
    </ul>
  );
};

TodoList.propTypes = {
  todoList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ).isRequired,
  onRemoveTodo: PropTypes.func.isRequired,
  onReorderTodo: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onEditTodo: PropTypes.func.isRequired,
};

export default TodoList;

// import TodoListItem from "./TodoListItem";

// function TodoList({ todoList, onRemoveTodo }) {
//   return (
//     <ul>
//       {todoList.map((todo) => (
//         <TodoListItem key={todo.id} todo={todo} onRemoveTodo={onRemoveTodo} />
//       ))}
//     </ul>
//   );
// }

// export default TodoList;
