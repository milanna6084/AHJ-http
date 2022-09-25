export default class Requests {
  static sendRequest(method, url, task) {
    const sendUrl = `http://localhost:3000/${url}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, sendUrl);

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.response));
          } catch (e) {
            reject(e);
          }
        }
      });
      xhr.addEventListener('error', (error) => console.log(error));

      if (method === 'POST' || method === 'PUT') {
        const sentTask = JSON.stringify(task);
        xhr.send(sentTask);
      } else xhr.send();
    });
  }

  static async getAllTasks() {
    const response = await Requests.sendRequest('GET', '?reqName=allTasks', null);
    return response;
  }

  static getTaskById(id) {
    return this.sendRequest('GET', `?reqName=taskById&id=${id}`);
  }

  static removeTask(id) {
    return this.sendRequest('GET', `?reqName=removeTask&id=${id}`);
  }

  static editTask(task) {
    return this.sendRequest('POST', '?reqName=editTask', task);
  }

  static addTask(task) {
    return this.sendRequest('POST', '?reqName=addTask', task);
  }
}
