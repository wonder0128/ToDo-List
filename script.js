const todoInput = document.querySelector('#todo-input');
const todoList = document.getElementById('todo-list');

const createTodo = function() {
  const newLi = document.createElement('li');
  const newSpan = document.createElement('span'); 
  const newBtn = document.createElement('button');

  newBtn.addEventListener('click', () => {
    newLi.classList.toggle('completed');
  })

  newLi.addEventListener('dblclick', () => {
    newLi.remove();
  })

  newSpan.textContent = todoInput.value;
  newLi.appendChild(newBtn);
  newLi.appendChild(newSpan);
  todoList.appendChild(newLi);

  todoInput.value = '';
  saveItemsFn();
}

const keyCodeCheck = function() {
  if(window.event.keyCode === 13 && todoInput.value !== '') {
    createTodo();
  }
}

const deleteAll = function() {
  const liList = document.querySelectorAll('li');
  liList.forEach(li => {
    li.remove();
  })
}

const saveItemsFn = function() {
  const saveItems = [];
  const todo = todoList.querySelectorAll('li');
  
  todo.forEach(li => {
    const todoObj = {
      contents: li.querySelector('span').textContent,
      completed: li.classList.contains('completed')
    }
    saveItems.push(todoObj);
  })
  console.log(saveItems);
}