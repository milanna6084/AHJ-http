import Requests from './requests';

export default class TaskManager {
  constructor(activeTask) {
    this.activeTask = activeTask;
  }

  editTask() {
    return Requests.editTask(this.activeTask).then(
      (editedTask) => editedTask,
      (error) => console.error(error),
    );
  }

  removeTask() {
    return Requests.removeTask(this.activeTask.id).then(
      (removedTask) => removedTask,
      (error) => console.error(error),
    );
  }

  addTask() {
    return Requests.addTask(this.activeTask).then(
      (newTask) => newTask,
      (error) => console.error(error),
    );
  }
}
