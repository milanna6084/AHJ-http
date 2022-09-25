import Requests from './requests';

export default class TaskElement {
  static activeFormManager;

  static registerFormManager(formManager) {
    TaskElement.activeFormManager = formManager;
  }

  static formatDate(date) {
    const convertedDate = new Date(date).toLocaleDateString();
    const onlyDate = convertedDate.slice(0, 6) + convertedDate.substring(8);
    const onlyTime = new Date(date).toLocaleTimeString().slice(0, 5);
    const newDate = `${onlyDate}  ${onlyTime}`;
    return newDate;
  }

  static addButtonEventListener() {
    const addButton = document.querySelector('.button-add');

    addButton.addEventListener('click', (event) => {
      event.preventDefault();
      console.log(TaskElement.activeFormManager);
      TaskElement.activeFormManager.addFormOpen();
    });
  }

  static addControlsListeners(params) {
    const {
      taskItem,
      checkControl,
      editControl,
      removeControl,
    } = params;

    editControl.addEventListener('click', (e) => {
      const currentTask = e.target.closest('.task');
      const id = currentTask.getAttribute('data-id');

      TaskElement.activeFormManager.editFormOpen(id);
    });

    removeControl.addEventListener('click', (e) => {
      const currentTask = e.target.closest('.task');
      const id = currentTask.getAttribute('data-id');

      TaskElement.activeFormManager.removeFormOpen(id);
    });

    checkControl.addEventListener('click', (e) => {
      const id = e.target.closest('.task').getAttribute('data-id');

      (async () => {
        const newTask = await Requests.getTaskById(id);

        if (newTask.status) {
          newTask.status = false;
          e.target.classList.remove('fa-check');
        } else {
          newTask.status = true;
          e.target.classList.add('fa-check');
        }

        await Requests.editTask(newTask);
      })();
    });

    taskItem.addEventListener('click', (e) => {
      const item = e.target.closest('.task');
      const id = item.getAttribute('data-id');
      const discription = item.querySelector('.task-discription');

      Requests.getTaskById(id).then((data) => {
        if (discription.style.display === 'block') {
          discription.style.display = 'none';
          discription.textContent = '';
        } else {
          discription.style.display = 'block';
          discription.textContent = data.fullDis;
        }
      });
    });
  }

  static addElement(task) {
    const {
      shortDis,
      fullDis,
      date,
      id,
      status,
    } = task;

    const tasksList = document.querySelector('.tasks');
    const newListItem = document.createElement('li');
    const checkControl = document.createElement('span');
    const taskItem = document.createElement('div');
    const nameItem = document.createElement('span');
    const disItem = document.createElement('p');
    const dateItem = document.createElement('span');
    const editControl = document.createElement('span');
    const removeControl = document.createElement('span');

    newListItem.classList.add('task');
    newListItem.dataset.id = id;

    checkControl.classList.add('control', 'check-item', 'fa');

    if (status) {
      checkControl.classList.add('fa-check');
    }

    taskItem.classList.add('task-item');

    nameItem.classList.add('task-name');
    nameItem.textContent = shortDis;

    disItem.classList.add('task-discription');
    disItem.textContent = fullDis;

    dateItem.classList.add('date');
    dateItem.textContent = TaskElement.formatDate(date);

    editControl.classList.add('control', 'fa', 'fa-pencil');

    removeControl.classList.add('control', 'fa', 'fa-times');

    tasksList.appendChild(newListItem);
    newListItem.appendChild(checkControl);
    newListItem.appendChild(taskItem);
    taskItem.appendChild(nameItem);
    taskItem.appendChild(disItem);
    newListItem.appendChild(dateItem);
    newListItem.appendChild(editControl);
    newListItem.appendChild(removeControl);

    TaskElement.addControlsListeners({
      taskItem,
      newListItem,
      checkControl,
      editControl,
      removeControl,
    });
  }

  static editElement(editedTaskElem) {
    const currentElement = document.querySelector(`[data-id='${editedTaskElem.id}']`);
    const taskItem = currentElement.querySelector('.task-item');
    const taskName = taskItem.querySelector('.task-name');
    const taskDis = taskItem.querySelector('.task-discription');

    taskName.textContent = editedTaskElem.shortDis;
    taskDis.textContent = editedTaskElem.fulltDis;
  }

  static removeElement(removedTaskElem) {
    const currentElement = document.querySelector(`[data-id='${removedTaskElem.id}']`);
    currentElement.remove();
  }
}
