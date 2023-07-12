import { projects } from "./projects"

const projectTitle = document.querySelector(".project-title")
const taskList = document.querySelector(".task-list")

const allBtn = document.querySelector("#all-btn")
const todayBtn = document.querySelector("#today-btn")
const weekBtn = document.querySelector("#week-btn")

export const createDOM = () => {
    displayAllTasks()
}
//Navbar buttons
allBtn.addEventListener("click", ()=> displayAllTasks())
todayBtn.addEventListener("click", ()=> displayToday())
weekBtn.addEventListener("click", ()=> displayWeek())

function displayAllTasks() {
    projectTitle.textContent = "All tasks"
}

function displayToday() {
    projectTitle.textContent = "Today"
}

function displayWeek() {
    projectTitle.textContent = "This week"
}

//Add new task form
const titleInput = document.querySelector("#title")
const dateInput = document.querySelector("#date")

const form = document.querySelector("#task-form")
form.addEventListener("submit", (e)=> {
    e.preventDefault()
    projects.addTask(titleInput.value, dateInput.value)
    console.log(projects.myProject)
    form.reset()
})