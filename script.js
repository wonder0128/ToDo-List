const todoInput = document.querySelector('#todo-input');
const todoList = document.getElementById('todo-list');

const savedTodoList = JSON.parse(localStorage.getItem('saved-items'));

const createTodo = function(storageData) {
  let todoContents = todoInput.value;

  if(storageData){
    todoContents = storageData.contents;
  }

  const newLi = document.createElement('li');
  const newSpan = document.createElement('span'); 
  const newBtn = document.createElement('button');

  newBtn.addEventListener('click', () => {
    newLi.classList.toggle('completed');
    saveItemsFn();
  })

  newLi.addEventListener('dblclick', () => {
    newLi.remove();
    saveItemsFn();
  })

  if(storageData?.completed) {
    newLi.classList.add('completed');
  }

  newSpan.textContent = todoContents;
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
    saveItemsFn();
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

  saveItems.length === 0 ? localStorage.removeItem('saved-items') : localStorage.setItem('saved-items', JSON.stringify(saveItems));
}

if(savedTodoList) {
  savedTodoList.forEach(item => {
    createTodo(item);
  })
}
const weatherSearch = function (position) {
  const apiId = 'd78cb31674ee0bd47baeb82f3b527bb8';
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${apiId}`
  )
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    console.log(json.name, json.weather[0].description)
  })
  .catch((err) => {
    console.err(err)
  })
  
}

const accessToGeo = function(position) {
  const positionObj = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude 
  }
  weatherSearch(positionObj)
}

const askForLocation = function () {
  navigator.geolocation.getCurrentPosition(accessToGeo, (err) => {
    console.log(err)
  });
}
askForLocation();
