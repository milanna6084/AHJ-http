import TaskManager from './TaskManager';
import Requests from './requests';
import Task from './Task';
import TaskElement from './TaskElement';

export default class FormsManager {
  constructor() {
    this.addForm = document.querySelector('.form_add-ticket');
    this.editForm = document.querySelector('.form_edit-ticket');
    this.removeForm = document.querySelector('.form_remove-ticket');
  }

  static activeTaskManager;

  addFormsButtonsListeners() {
    const okButtonAdd = document.querySelector('.form_add-ticket .button-ok');
    const okButtonEdit = document.querySelector('.form_edit-ticket .button-ok');
    const okButtonRemove = document.querySelector('.form_remove-ticket .button-ok');

    const cancelButtons = document.querySelectorAll('.button-cancel');

    okButtonAdd.addEventListener('click', (e) => {
      e.preventDefault();

      const shortDis = this.addForm.querySelector('.short-dis').value;
      const fullDis = this.addForm.querySelector('.full-dis').value;
      const newTask = new Task(shortDis, fullDis);
      const newActiveTaskManager = new TaskManager(newTask);

      (async () => {
        const addedTask = await newActiveTaskManager.addTask();
        TaskElement.addElement(addedTask);
      })();

      this.addForm.style.display = 'none';
    });

    okButtonEdit.addEventListener('click', (e) => {
      e.preventDefault();

      FormsManager.activeTaskManager.activeTask.shortDis = this.editForm.querySelector('.short-dis').value;
      FormsManager.activeTaskManager.activeTask.fullDis = this.editForm.querySelector('.full-dis').value;

      (async () => {
        const editedTask = await FormsManager.activeTaskManager.editTask();
        TaskElement.editElement(editedTask);
      })();

      this.editForm.style.display = 'none';
    });

    okButtonRemove.addEventListener('click', (e) => {
      e.preventDefault();
      FormsManager.activeTaskManager.removeTask();

      this.removeForm.style.display = 'none';
      TaskElement.removeElement(FormsManager.activeTaskManager.activeTask);
    });

    [...cancelButtons].forEach((element) => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.target.closest('form').style.display = 'none';
      });
    });
  }

  editFormOpen(taskId) {
    this.editForm.style.display = 'flex';

    this.editForm.querySelector('.short-dis').value = '';
    this.editForm.querySelector('.full-dis').value = '';

    Requests.getTaskById(taskId).then((data) => {
      this.editForm.querySelector('.short-dis').value = data.shortDis;
      this.editForm.querySelector('.full-dis').value = data.fullDis;
      FormsManager.activeTaskManager = new TaskManager(data);
    });
  }

  removeFormOpen(taskId) {
    this.removeForm.style.display = 'flex';
    Requests.getTaskById(taskId).then((data) => {
      FormsManager.activeTaskManager = new TaskManager(data);
    });
  }

  addFormOpen() {
    this.addForm.style.display = 'flex';
    this.addForm.querySelector('.short-dis').value = '';
    this.addForm.querySelector('.full-dis').value = '';
  }
}
