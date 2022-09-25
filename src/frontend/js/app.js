import FormsManager from './FormsManager';
import TableManager from './TableManager';
import TaskElement from './TaskElement';

export default class App {
  static run() {
    const formManager = new FormsManager();

    formManager.addFormsButtonsListeners();

    TaskElement.registerFormManager(formManager);

    TaskElement.addButtonEventListener();

    TableManager.drawTable();
  }
}
