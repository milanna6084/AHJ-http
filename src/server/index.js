const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-body');
const cors = require('@koa/cors');

const app = new Koa();

const tasks = [
  {
    shortDis: 'Ремонт принтера',
    fullDis: 'Замена печатающей головки',
    id: '14',
    status: false,
    date: '2022-09-08T10:52:55.019Z',
  },
  {
    shortDis: 'Ремонт компьютера',
    fullDis: 'Чистка компьютера от пыли, замена термопасты ',
    id: '15',
    status: false,
    date: '2022-09-08T10:52:30.688Z',
  },
  {
    shortDis: 'Ремонт планшета',
    fullDis: 'Замена дисплея',
    id: '16',
    status: false,
    date: '2022-09-08T10:52:42.263Z',
  },

];

function createId() {
  const id = (Math.floor(Math.random() * 100)).toString();

  if ((tasks.find((item) => item.id === id)) !== -1) {
    return id.toString();
  }
  return this.createId();
}

app.use(bodyParser({
  multipart: true,
  urlencoded: true,
  json: true,
}));

app.use(cors());

app.use(async (ctx) => {
  const params = new URLSearchParams(ctx.request.querystring);
  const reqName = params.get('reqName');
  const id = params.get('id');

  let task = null;
  let taskIndex;
  let shortTasks = [];

  switch (reqName) {
    case 'allTasks':
      shortTasks = tasks.map((element) => {
        task = { ...element };
        task.fullDis = '';
        return task;
      });
      ctx.response.body = shortTasks;
      break;

    case 'taskById':
      task = tasks.find((element) => element.id === id);
      if (task) {
        ctx.response.body = task;
      } else ctx.response.console.error('There is not task with this id');
      break;

    case 'editTask':
      task = JSON.parse(ctx.request.body);
      taskIndex = tasks.findIndex((element) => element.id === task.id);
      if (taskIndex >= 0) {
        tasks[taskIndex] = { ...task };
        ctx.response.body = task;
      } else console.log(`Error status ${ctx.status}`);
      break;

    case 'removeTask':
      tasks.splice(tasks.findIndex((element) => element.id === id), 1);
      ctx.response.body = {};
      break;

    case 'addTask':
      task = JSON.parse(ctx.request.body);
      task.id = createId();
      task.date = new Date();
      tasks.push(task);
      ctx.response.body = task;
      break;

    // TODO: обработка остальных методов
    default:
      ctx.response.status = 404;
  }
});

const port = process.env.PORT || 3000;
const server = http.createServer(app.callback());

server.listen(port, () => {
  console.log(`Server is running on http://${port}`);
});
