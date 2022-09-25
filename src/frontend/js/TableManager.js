import Requests from './requests';
import TaskElement from './TaskElement';

export default class TableManager {
  static clearTable() {
    const tasksList = document.querySelector('.tasks');

    while (tasksList.firstChild) {
      tasksList.firstChild.remove();
    }
  }

  static drawTable() {
    (async () => {
      const tasks = await Requests.getAllTasks();
      tasks.forEach((task) => TaskElement.addElement(task));
    })();
  }

  static reloadTable() {
    TableManager.clearTable();
    TableManager.drawTable();
  }
}
