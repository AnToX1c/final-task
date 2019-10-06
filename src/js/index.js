const URL = 'http://localhost:3333/tasks';

const newTaskButton = document.querySelector('.new-task');
const form = document.querySelector('.form-task');

function getResponse(url, cb) {
  return fetch(url)
  .then(response => response.json())
  .then(obj => cb(obj))
  .catch(error => console.error(`ERROR: ${error.stack}`));
}

function postData(url = '', data = {}) {
  return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
}
function putData(url = '', data = {}) {
  return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
}
function deleteData(url = '') {
  return fetch(url, {
      method: 'DELETE'
  })
}

function onCreateTaskClick(e) {
  e.preventDefault();
  postData(URL, getTaskValues())
  .then(closeForm())
  .then(getResponse(URL, updateTasksList))
  .catch(error => console.error(error.stack));
}
function onSaveTaskClick(e) {
  e.preventDefault();
  const targetId = e.target.dataset.id;
  putData(`${URL}/${targetId}`, getTaskValues())
  .then(closeForm())
  .then(getResponse(URL, updateTasksList))
  .catch(error => console.error(error.stack));
}

function getTaskValues() {
  let obj = {};
  obj.title = form.querySelector('.form-header .text').innerText;
  obj.location = form.querySelector('.form-location .text').value;
  obj.type = form.querySelector('.form-type input[type="radio"]:checked').value;
  obj.description = form.querySelector('.form-description .textarea').value;
  return obj;
}

function getTasksNode(tasks) {
  const newElement = document.createElement('ul');
  let str = '';
  newElement.classList.add('tasks-list');
  for (let task of tasks) {
    str += `<li class="task-block" data-id=${task.id}>
    <date>${task.date}</date>
    <p class="title">${task.title}</p>
    <div>
      <button class="button button-edit">Edit</button>
      <button class="button button-delete">Delete</button>
    </div>
  </li>`
  }
  newElement.innerHTML = str;
  const editButtons = newElement.querySelectorAll('.button-edit');
  const deleteButtons = newElement.querySelectorAll('.button-delete');
  editButtons.forEach((btn) => btn.addEventListener('click', onEditButtonClickHandler));
  deleteButtons.forEach((btn) => btn.addEventListener('click', onDeleteButtonClick));
  return newElement;
}

function updateTasksList() {
  getResponse(URL, renderTasksList);
}

function renderTasksList(tasks) {
  const tasksContainer = document.querySelector('.tasks-list');
  tasksContainer.parentNode.replaceChild(getTasksNode(tasks), tasksContainer);
}

function onEditButtonClickHandler(e) {
  const targetId = e.target.parentNode.parentNode.dataset.id;
  getResponse(`${URL}/${targetId}`, openForm);
}

function openForm(obj = {}) {
  form.innerHTML = '';
  const newForm = new Form(obj);
  form.append(newForm.render());
  let titleValues = [
    form.querySelector('.form-type input[type="radio"]:checked').value.toLowerCase(),
    form.querySelector('.form-description .textarea').value.toLowerCase()
  ];

  function updateTitle() {
    form.querySelector('.form-header .text').innerText = `I need a ${titleValues[0]}, ${titleValues[1]}`;
  }

  function updateRadio(value) {
    titleValues[0] = value.toLowerCase();
    updateTitle();
    form.querySelector('.form-tasks .form-section-title').innerText = value + ' tasks';
  }

  function updateTextarea(value) {
    titleValues[1] = value.toLowerCase();
    updateTitle();
  }

  updateTitle();

  form.style.right = '0';
  const createTaskButton = form.querySelector('.create-task');
  if (createTaskButton) {
    createTaskButton.addEventListener('click', onCreateTaskClick);
  } else {
    const saveTaskButton = form.querySelector('.edit-task');
    if (saveTaskButton) {
      saveTaskButton.addEventListener('click', onSaveTaskClick);
    }
  }
  
  function changeAddressField(value) {
    form.querySelector('.address').innerText = `My address is ${value}`;
  };
  form.querySelector('.form-location input[type="text"]').addEventListener('input', (e) => {changeAddressField(e.target.value)});
  const radioButtons = form.querySelectorAll('.form-type input[type="radio"]');
  radioButtons.forEach(btn => btn.addEventListener('change', function() {updateRadio(this.value)}));
  form.querySelector('.form-description .textarea').addEventListener('input', (e) => {updateTextarea(e.target.value)});
}

function closeForm() {
  const createTaskButton = form.querySelector('.create-task');
  if (createTaskButton) {
    createTaskButton.removeEventListener('click', onCreateTaskClick);
  }
  const saveTaskButton = form.querySelector('.edit-task');
  if (saveTaskButton) {
    saveTaskButton.removeEventListener('click', onSaveTaskClick);
  }
  form.innerHTML = '';
  form.style.right = '-510px';
  init();
}

function deleteTask(id) {
  deleteData(`${URL}/${id}`)
  .then(getResponse(URL, updateTasksList))
  .catch(error => console.error(error.stack));
}

function onNewTaskClick() {
  openForm();
  newTaskButton.removeEventListener('click', onNewTaskClick);
}
function onDeleteButtonClick(e) {
  const targetId = e.target.parentNode.parentNode.dataset.id;
  deleteTask(targetId);
}

function Form(task) {
  this.name = task.title ? 'edit' : 'new';
  this.id = task.id ? task.id : null;
  this.title = task.title ? task.title : 'I need';
  this.location = task.location || '';
  this.type = task.type || 'electrician';
  this.description = task.description || '';
  this.render = function() {
    this._element = this.template();
    return this._element;
  }

  this.template = function() {
    const newElement = document.createElement('fieldset');
    newElement.innerHTML = `<div class="form-section form-header">
    <p class="form-section-title">${this.name} Task</p>
    <p class="text">
      ${this.title}
      <!-- I need <b>a plumber</b> to <b>unblock a toilet</b>, <b>my daughter's teddy bear sink in the toilet.</b> -->
    </p>
    <p class="address">My address is ${this.location}</p>
    <button class="button ${this.name === 'new' ? 'create' : 'edit'}-task" data-id=${this.id}>${this.name === 'new' ? 'create' : 'save'} Task</button>
  </div>
  <div class="form-section form-location">
    <p class="form-section-title">Location</p>
    <input type="text" class="text" value="${this.location}" placeholder="Enter location"></input>
  </div>
  <div class="form-section form-type">
    <p class="form-section-title">Service Type</p>
    <div class="types">
    <input type="radio" id="electrician" name="service-type" class="input-hidden" value="electrician" ${this.type ==='electrician' && `checked`}>
    <label for="electrician">
      <div class="img_wrapper">
        <img src="./img/icons/noun_321339_cc.svg" alt="electrician">
      </div>
      <span>electrician</span>
    </label>
    <input type="radio" id="plumber" name="service-type" class="input-hidden" value="plumber" ${this.type ==='plumber' && `checked`}>
    <label for="plumber">
      <div class="img_wrapper">
        <img src="./img/icons/noun_321315_cc.svg" alt="plumber">
      </div>
      <span>plumber</span>
    </label>
    <input type="radio" id="gardener" name="service-type" class="input-hidden" value="gardener" ${this.type ==='gardener' && `checked`}>
    <label for="gardener">
      <div class="img_wrapper">
        <img src="./img/icons/noun_321363_cc.svg" alt="gardener">
        </div>
      <span>gardener</span>
    </label>
    <input type="radio" id="housekeeper" name="service-type" class="input-hidden" value="housekeeper" ${this.type ==='housekeeper' && `checked`}>
    <label for="housekeeper">
      <div class="img_wrapper">
        <img src="./img/icons/noun_321399_cc.svg" alt="housekeeper">
        </div>
      <span>housekeeper</span>
    </label>
    <input type="radio" id="cook" name="service-type" class="input-hidden" value="cook" ${this.type ==='cook' && `checked`}>
    <label for="cook">
      <div class="img_wrapper">
        <img src="./img/icons/noun_321395_cc.svg" alt="cook">
        </div>
      <span>cook</span>
    </label>
    </div>
  </div>
  <div class="form-section form-tasks">
    <p class="form-section-title">${this.type} tasks</p>
  </div>
  <div class="form-section form-description">
    <p class="form-section-title">Task description</p>
    <textarea class="textarea" name="textarea" rows="5" cols="40" placeholder="Enter task description">${this.description}</textarea>
  </div>`;
    return newElement;
  }
}

function init() {
  updateTasksList();
  newTaskButton.addEventListener('click', onNewTaskClick);
}

init();
