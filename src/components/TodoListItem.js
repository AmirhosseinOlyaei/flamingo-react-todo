import { useState } from "react";
import styles from "./TodoListItem.module.css";
import PropTypes from "prop-types";

function TodoListItem({ todo, onRemoveTodo, onToggleComplete, onEditTodo }) {
  const { title, id, completed } = todo;
  const [isChecked, setIsChecked] = useState(completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = () => {
    if (isEditing) {
      onEditTodo(id, editedTitle);
    }
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    onEditTodo(todo.id, editedTitle);
    setIsEditing(false); // Exit editing mode
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    onToggleComplete(id, !isChecked);
  };

  return (
    <div className={styles.container}>
      {/* checkbox */}
      <div className={styles.column}>
        <input
          type="checkbox"
          className={styles.customCheckbox}
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      {/* <span style={{ color: isChecked ? "grey" : "inherit" }}>{title}</span> */}
      <div className={styles.column}>
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className={styles.editInput}>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              autoFocus
            />
          </form>
        ) : (
          <span className={isChecked ? styles.completedTodo : ""}>{title}</span>
        )}
      </div>
      {/* Edit Button */}
      <div className={styles.column}>
        <button type="button" className={styles.button} onClick={handleEdit}>
          <div className={styles.buttonIcon}>
            {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.editSvgIcon}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            }
          </div>
        </button>
      </div>
      {/* Remove Button */}
      <div className={styles.column}>
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            onRemoveTodo(id);
          }}
        >
          <div className={styles.buttonIcon}>
            {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.removeSvgIcon}
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                  clipRule="evenodd"
                />
              </svg>
            }
          </div>
        </button>
      </div>
    </div>
  );
}

TodoListItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool,
  }).isRequired,
  onRemoveTodo: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onEditTodo: PropTypes.func.isRequired,
};

export default TodoListItem;
