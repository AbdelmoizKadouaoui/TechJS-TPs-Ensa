const todoList = [{
  name: 'review course',
  dueDate: '2025-09-29'
}];

// renderTodoList();



function renderTodoList() {
  let todo_Section = document.querySelector('.js-todo-list')
  todo_Section.innerHTML='';

  let todoListHTML = '<div> ';
  for (const todo in todoList) {
    console.log(todo)
    todoListHTML += "<div class= 'todo_line'> <p> "+todoList[todo].name + "</p> <p> "+todoList[todo].dueDate + "</p> <button class= 'delete_todo' onClick= {deletetodo("+todo+")}> Delete </button> </div>"
  }
  todoListHTML += '</div> ';
  // Loop over every toDo object and append it to "todoListHTML"
  // Show the objects inside the class "js-todo-list"
  // Loop over evey delete button and add an eventListener that deletes the toDo and rerender the Tasks
  console.log(todoListHTML)
  todo_Section.insertAdjacentHTML('afterbegin', todoListHTML); 

}

document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
  });

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;
  

  // Add these values to the variable "todoList"
  todoList.push({"name" : inputElement.value  , "dueDate": dueDate})
  renderTodoList();
  inputElement.value = '';
}

function deletetodo(todo) {
   delete todoList[todo];
   renderTodoList();

}