let taskListElem;
// タスクの連想配列の配列
let tasks = [
  {
    name: "ライブの申し込み",
    dueDate: "2022/03/01",
    isCompleted: false,
  },
  {
    name: "セトリの予想",
    dueDate: "2022/03/20",
    isCompleted: false,
  },
  {
    name: "サイリウムの注文",
    dueDate: "2022/03/31",
    isCompleted: false,
  },
];

window.addEventListener("load", function () {
  // リストを取得
  taskListElem = document.querySelector("ul");

  // LocalStorageから配列を読み込む
  loadTasks();

  // 配列からリストを出力
  renderTasks();
});

function renderTasks() {
  // リストの中身をキレイキレイ
  taskListElem.innerHTML = "";

  // 完了済みタスクの件数を数えるための変数を初期化
  let numOfCompletedTasks = 0;

  // 今日の日付を取得
  let todayDate = new Date();
  todayDate.setHours(0);
  todayDate.setMinutes(0);
  todayDate.setSeconds(0);
  todayDate.setMilliseconds(0);

  // 明日の日付を取得
  let tomorrowDate = new Date();
  tomorrowDate.setHours(0);
  tomorrowDate.setMinutes(0);
  tomorrowDate.setSeconds(0);
  tomorrowDate.setMilliseconds(0);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  for (let task of tasks) {
    // リストの項目を作成
    let taskElem = document.createElement("li");
    taskElem.innerText = task.name;

    // タスクの期限日をDate型でnew
    let taskDueDate = new Date(task.dueDate + " 00:00:00");

    // 項目をクリックされたときの動作を設定
    taskElem.addEventListener("click", function () {
      // リストの項目をクリックされたときは、タスクの完了状態をトグル
      toggleTaskComplete(task.name);
    });

    taskElem.addEventListener("dblclick", function () {
      // リストの項目をダブルクリックされたときは、タスクを削除
      deleteTask(task.name);
    });

    // タスクの完了状態に応じ、項目の取り消し線を設定
    if (task.isCompleted) {
      taskElem.style.textDecorationLine = "line-through";
      numOfCompletedTasks++;
    } else {
      taskElem.style.textDecorationLine = "none";
    }

    // 期限表示を作成
    let taskDueDateElem = document.createElement("span");
    taskDueDateElem.style.fontSize = "0.8rem";
    taskDueDateElem.style.fontSize = "italic";
    taskDueDateElem.style.marginLeft = "1rem";

    // 今日の日付とタスクの期限を比較
    // 期限切れのもの:赤色
    if (taskDueDate < todayDate) {
      taskDueDateElem.style.color = "#c0392b";
    }
    // 今日が期限のもの:黄色
    let matched = taskDueDate.getTime() == todayDate.getTime();
    if (matched) {
      taskDueDateElem.style.color = "#e67e22";
    }
    // 明日以降が期限のもの:黒色
    if (taskDueDate > tomorrowDate) {
      taskDueDateElem.style.color = "#333";
    }

    // タスクの日付を代入
    if (task.dueDate) {
      taskDueDateElem.innerText = task.dueDate;
    } else {
      taskDueDateElem.innerText = "";
    }

    let taskRemainDateNum = 0;
    let taskRemainDateElem = document.createElement("span");

    // タスクの期日が設定済みのときの処理
    if (task.dueDate) {
      if (taskDueDate >= todayDate) {
        let taskRemainTime = taskDueDate.getTime() - todayDate.getTime();
        taskRemainDateNum = Math.floor(taskRemainTime / (1000 * 60 * 60 * 24));

        // タスクの残り日数を表示
        let taskRemainText = "残り日数: " + taskRemainDateNum + "日";
        taskRemainDateElem.innerText = taskRemainText;

        taskRemainDateElem.style.fontSize = "0.8rem";
        taskRemainDateElem.style.marginLeft = "1rem";
      } else {
        // タスクの残り日数を表示
        let taskRemainText = "期限が過ぎています";
        taskRemainDateElem.innerText = taskRemainText;

        taskRemainDateElem.style.fontSize = "0.8rem";
        taskRemainDateElem.style.marginLeft = "1rem";
        taskRemainDateElem.style.color = "red";
      }
    }

    // 項目に対し、期限表示を追加
    taskElem.appendChild(taskDueDateElem);

    // 項目に対し、期限表示を追加
    taskElem.appendChild(taskRemainDateElem);

    // リストに対し、項目を追加
    taskListElem.appendChild(taskElem);
  }

  // 全タスクの件数を代入
  let numOfTasksElem = document.querySelector("#numOfTasks");
  numOfTasksElem.innerText = tasks.length;

  // 完了済みタスクの代入
  let numOfCompletedTasksElem = document.querySelector("#numOfCompletedTasks");
  numOfCompletedTasksElem.innerText = numOfCompletedTasks;
}

function addTask(taskName, taskDueDate) {
  // 同名タスクの登録防止
  for (let task of tasks) {
    if (task.name == taskName) {
      window.alert("既に登録済みです");
      return;
    }
  }

  // 配列の末尾に項目を追加
  tasks.push({
    name: taskName,
    dueDate: taskDueDate,
    isCompleted: false,
  });

  // LocalStorageに配列を保存
  saveTasks();

  // 配列からリストを再出力
  renderTasks();

  // フォームをクリア
  document.querySelector("#addTaskForm").reset();
}

function deleteTask(taskName) {
  // 新しい配列を用意
  let newTasks = [];

  // 現状の配列を反復
  for (let task of tasks) {
    if (task.name != taskName) {
      // 削除したいタスク名でなければ、新しい配列へ追加
      newTasks.push(task);
    }
  }
  // 現状の配列を新しい配列で上書き
  tasks = newTasks;

  // LocalStorageに配列を保存
  saveTasks();

  // 配列からリストを再出力
  renderTasks();
}

function toggleTaskComplete(taskName) {
  // 現状の配列を反復
  for (let task of tasks) {
    if (task.name == taskName) {
      // 対象のタスクならば、完了状態をトグル
      task.isCompleted = !task.isCompleted;
    }
  }

  // LocalStorageに配列を保存
  saveTasks();

  // 配列からリストを再出力
  renderTasks();
}

function loadTasks() {
  let jsonString = window.localStorage.getItem("tasks");
  if (jsonString) {
    // 文字列のままだと、キーを使用して値を取り出せないので、json形式にパースして変数に代入
    tasks = JSON.parse(jsonString);
  }
}

function saveTasks() {
  let jsonString = JSON.stringify(tasks);
  // ローカルストレージには、文字列しか保存できないので、json形式から文字列にパースしてから保存
  window.localStorage.setItem("tasks", jsonString);
}
