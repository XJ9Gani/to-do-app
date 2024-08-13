const link = document.querySelectorAll(".pages__link");
const tasksPage = document.querySelector(".tasks");

const tasks__overdue = document.querySelector(".tasks__overdue");
const tasks__done = document.querySelector(".tasks__done");
const tasks__all = document.querySelector(".tasks__all");

let page1 = document.getElementById("page1");
let page2 = document.getElementById("page2");
let page3 = document.getElementById("page3");

// Обработчик навигации между страницами
for (let item of link) {
  item.addEventListener("click", function (event) {
    tasksPage.classList.add("changePageAnim");
    setTimeout(() => {
      tasksPage.classList.remove("changePageAnim");
    }, 200);
    switch (event.target.textContent) {
      case "ALL":
        page1.hidden = false;
        page2.hidden = true;
        page3.hidden = true;
        break;
      case "Overdue":
        page1.hidden = true;
        page2.hidden = false;
        page3.hidden = true;
        break;
      case "Done":
        page1.hidden = true;
        page2.hidden = true;
        page3.hidden = false;
        break;
      default:
        page1.hidden = false;
        page2.hidden = true;
        page3.hidden = true;
    }
  });
}

const validForms = document.forms;
const formTask = validForms.addTaskForm.elements;

let task__title = formTask.task__title;
let task__description = formTask.task__description;
let task__createDate = formTask.task__createDate;
let task__deadline = formTask.task__deadline;
let task__submit = formTask.task__submit;

// Функция для сохранения задачи в localStorage
const setToLocalStorage = () => {
  if (localStorage.getItem(task__title.value)) {
    alert("Это задание уже существует.");
    return;
  }
  let obj = {
    title: task__title.value,
    description: task__description.value,
    createdDate: task__createDate.value,
    deadline: task__deadline.value,
    done: false, // По умолчанию задача не выполнена
    overdue: false,
  };

  localStorage.setItem(task__title.value, JSON.stringify(obj));
  task__title.value = "";
  task__description.value = "";
  task__createDate.value = "";
  task__deadline.value = "";

  displayDataFromLocalStorage();
};

// Функция для отображения данных из localStorage
function displayDataFromLocalStorage() {
  tasks__all.innerHTML = "";
  tasks__done.innerHTML = "";
  tasks__overdue.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {
    let taskArrJSONForm = localStorage.getItem(localStorage.key(i));
    let taskArrObjForm = JSON.parse(taskArrJSONForm);

    let block = document.createElement("section");
    let block__title = document.createElement("h1");
    let block__description = document.createElement("p");
    let block__startDay = document.createElement("h1");
    let block__deadline = document.createElement("h1");

    let options = document.createElement("div");
    let removeBtn = document.createElement("button");
    let editBtn = document.createElement("button");
    let checkBtn = document.createElement("input");

    checkBtn.type = "checkbox";
    checkBtn.checked = taskArrObjForm.done;

    removeBtn.textContent = "X";
    editBtn.textContent = "E";
    block__title.innerText = taskArrObjForm.title;
    block__description.innerText = taskArrObjForm.description;
    block__startDay.innerText = `ДАТА НАЧАЛА ЗАДАНИЯ : ${taskArrObjForm.createdDate}`;
    block__deadline.innerText = `ДАТА СДАЧИ ЗАДАНИЯ : ${taskArrObjForm.deadline}`;

    block.classList.add("task__block");
    block__title.classList.add("task__block--title");
    block__description.classList.add("task__block--description");
    block__startDay.classList.add("task__block--start");
    block__deadline.classList.add("task__block--deadline");
    options.classList.add("options");
    removeBtn.classList.add("options--remove");
    editBtn.classList.add("options--edit");
    checkBtn.classList.add("options--check");

    block.append(
      block__title,
      block__description,
      block__startDay,
      block__deadline,
      options
    );
    options.append(removeBtn, editBtn, checkBtn);

    if (taskArrObjForm.done) {
      block.classList.add("done");
      editBtn.hidden = true;
      tasks__done.append(block);
    } else if (taskArrObjForm.overdue) {
      block.classList.add("overdue");
      tasks__overdue.append(block);
      editBtn.hidden = false;
      checkBtn.hidden = true;
      removeBtn.hidden = true;
    } else {
      tasks__all.append(block);
      editBtn.hidden = false;
      removeBtn.hidden = false;
    }

    if (taskArrObjForm.deadline) {
      let deadline = new Date(taskArrObjForm.deadline);
      let currentDay = new Date();

      if (deadline < currentDay) {
        taskArrObjForm.overdue = true;
        localStorage.setItem(
          taskArrObjForm.title,
          JSON.stringify(taskArrObjForm)
        );
      }
    }

    checkBtn.addEventListener("change", () => {
      let isDone = checkBtn.checked;
      block.classList.toggle("done", isDone);

      taskArrObjForm.done = isDone;
      localStorage.setItem(
        taskArrObjForm.title,
        JSON.stringify(taskArrObjForm)
      );
      displayDataFromLocalStorage();
    });

    removeBtn.addEventListener("click", function () {
      localStorage.removeItem(taskArrObjForm.title);
      displayDataFromLocalStorage();
    });

    editBtn.addEventListener("click", function (event) {
      event.preventDefault();

      const modalWrapper = document.querySelector(".modal__wrapper");
      const closeBtn = document.querySelector(".close__btn");
      const saveBtn = document.querySelector(".edit__form--submit");
      const modalTitle = document.querySelector(".edit__form--title");
      const modalDescription = document.querySelector(
        ".edit__form--description"
      );
      const modalCreateDate = document.querySelector(".edit__form--startDay");
      const modalDeadline = document.querySelector(".edit__form--deadline");

      modalWrapper.style.display = "flex";

      let taskElement = event.target.closest(".task__block");
      let taskTitle = taskElement.querySelector(
        ".task__block--title"
      ).innerText;
      taskToEdit = JSON.parse(localStorage.getItem(taskTitle));

      modalTitle.value = taskToEdit.title;
      modalDescription.value = taskToEdit.description;
      modalCreateDate.value = taskToEdit.createdDate;
      modalDeadline.value = taskToEdit.deadline;

      closeBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modalWrapper.style.display = "none";
      });

      saveBtn.addEventListener("click", (event) => {
        event.preventDefault();

        if (
          modalTitle.value.trim() === "" ||
          modalDescription.value.trim() === "" ||
          modalCreateDate.value.trim() === "" ||
          modalDeadline.value.trim() === ""
        ) {
          alert("Не все заполнено");
          return;
        }

        let updatedTask = {
          title: modalTitle.value,
          description: modalDescription.value,
          createdDate: modalCreateDate.value,
          deadline: modalDeadline.value,
          done: taskToEdit.done,
          overdue: taskToEdit.overdue,
        };

        localStorage.removeItem(taskToEdit.title);
        localStorage.setItem(updatedTask.title, JSON.stringify(updatedTask));

        taskElement.querySelector(".task__block--title").innerText =
          updatedTask.title;
        taskElement.querySelector(".task__block--description").innerText =
          updatedTask.description;
        taskElement.querySelector(
          ".task__block--start"
        ).innerText = `ДАТА НАЧАЛА ЗАДАНИЯ : ${updatedTask.createdDate}`;
        taskElement.querySelector(
          ".task__block--deadline"
        ).innerText = `ДАТА СДАЧИ ЗАДАНИЯ : ${updatedTask.deadline}`;

        modalWrapper.style.display = "none";
      });
    });
  }
}

function handleStorageEvent(event) {
  if (event.storageArea === localStorage) {
    displayDataFromLocalStorage();
  }
}

window.addEventListener("storage", handleStorageEvent);

const checkExist = () => {
  displayDataFromLocalStorage();
};

checkExist();

const checkFillInput = (event) => {
  event.preventDefault();
  if (
    task__title.value === "" ||
    task__description.value === "" ||
    task__createDate.value === "" ||
    task__deadline.value === ""
  ) {
    alert("Не все заполнено");
  } else {
    setToLocalStorage();
  }
};

task__submit.addEventListener("click", checkFillInput);
