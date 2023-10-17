function AddTodoForm() {
  function handleAddTodo(event) {
    event.preventDefault();
    // Retrieve the value of the title element from the event target
    const todoTitle = event.target.elements.title.value;
    console.log(todoTitle);
    // Reset the form so the text input value is cleared
    event.target.reset();
  }
  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Title</label>
      <input type="text" id="todoTitle" name="title"></input>
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodoForm;
