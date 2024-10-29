const todoInput = document.querySelector('#todo-input');
const todoList = document.getElementById('todo-list');

const savedWeatherData = JSON.parse(localStorage.getItem('saved-weather'));
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
  if(window.event.keyCode === 13 && todoInput.value.trim() !== '') {
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

const weatherDataActive = function ({location, weather}) {
  const weatherMainList = ['Clear', 'Clouds', 'Drizzle', 'Rain', 'Snow', 'Thunderstorm'];
  weather = weatherMainList.includes(weather) ? weather : 'Fog';

  const locationNameTag = document.getElementById('location-name-tag');

  locationNameTag.textContent = location;
  document.body.style.backgroundImage = `url('./images/${weather}.jpg')`;

  if(!savedWeatherData || savedWeatherData.location !== location || savedWeatherData.weather !== weather) {
    localStorage.setItem('saved-weather', JSON.stringify({location, weather}));
  }
}

const weatherSearch = function ({latitude, longitude}) {
  const apiId = 'd78cb31674ee0bd47baeb82f3b527bb8';
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiId}`
  )
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    console.log(json.name, json.weather[0].main)
    const weatherData = {
      location: json.name,
      weather: json.weather[0].main
    }
    weatherDataActive(weatherData);
  })
  .catch((err) => {
    console.error(err)
  })
  
}

const accessToGeo = function({coords}) {
  const {latitude, longitude} = coords

  // Shorthand property
  const positionObj = {latitude,longitude};
  weatherSearch(positionObj)
}

const askForLocation = function () {
  navigator.geolocation.getCurrentPosition(accessToGeo, (err) => {
    console.log(err)
  });
}
askForLocation();

if(savedWeatherData){
  weatherDataActive(savedWeatherData);
}