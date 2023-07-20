import { projects } from "./projects"
const projectTitle = document.querySelector(".project-title")
const taskList = document.querySelector(".task-list")

const allBtn = document.querySelector("#all-btn")
const todayBtn = document.querySelector("#today-btn")
const weekBtn = document.querySelector("#week-btn")

export const createDOM = () => {
    renderTasks(selectedProjectIndex)
}
//Navbar buttons
allBtn.addEventListener("click", ()=> displayAllTasks())
todayBtn.addEventListener("click", ()=> displayToday())
weekBtn.addEventListener("click", ()=> displayWeek())

function displayAllTasks() {
    projectTitle.textContent = "All tasks"
    renderTasks("allTasks")
    selectProject("allTasks")
    console.log(projects.projectList)
    taskForm.classList.add("hidden")
}

function displayToday() {
    projectTitle.textContent = "Today"
}

function displayWeek() {
    projectTitle.textContent = "This week"
}

//Select project
let selectedProjectIndex = 0
function selectProject(index){
    selectedProjectIndex = index
    taskForm.classList.remove("hidden")
}

function renderProjects(){
    const projectContainer = document.querySelector(".project-list")
    projectContainer.innerHTML = "" // clear existing projects display when calling the function more than once
    for(let i = 0; i < projects.projectList.length; i++){
        projectContainer.innerHTML += `<div class="list-item-container">
        <button class="project-btn"> ${projects.projectList[i].title}</button><button class="remove-btn">remove</button>
        </div>`
    }
    //Remove projects
    const projectRemoveButtons = document.querySelectorAll(".remove-btn")
    projectRemoveButtons.forEach((btn, index) => {
        btn.addEventListener("click", (e)=>{
            projects.removeProject(index)
            let projectListItem = e.target.closest(".list-item-container") // Find the btn's container element: ".list-item-container"
            projectListItem.remove()
            renderProjects()
            if(selectedProjectIndex === "allTasks") {
                renderTasks("allTasks")
            }
            if(selectedProjectIndex > index) { //if you select a project and remove the one that comes before it, display the same selected project
                renderTasks(selectedProjectIndex-1)
                selectProject(selectedProjectIndex-1)
            } else if(selectedProjectIndex < index){ //if you select a project and remove the one that comes after it, display the same selected project
                renderTasks(selectedProjectIndex)
                selectProject(selectedProjectIndex)
            } else if(selectedProjectIndex === 0){ //if you select the first project and remove it, display the next project
                renderTasks(index)
                selectProject(index)
            } else if(selectedProjectIndex === index){ //if you select the last project and remove it, display the previous project
                renderTasks(index-1)
                selectProject(index-1)
            }
            if(projectRemoveButtons.length-1 === 0) { //if you remove all projects, display "all tasks" tab
                displayAllTasks()
            }
        })
    })
    //View selected project
    const selectProjectButtons = document.querySelectorAll(".project-btn")
    selectProjectButtons.forEach((btn, index)=> {
        btn.addEventListener("click", () => {
            selectProject(index)
            renderTasks(selectedProjectIndex)
        })
    })
} 

function renderTasks(projectIndex){
    const taskContainer = document.querySelector(".task-list")
    taskContainer.innerHTML = "" // clear existing tasks display when calling the function more than once
    if(projects.projectList.length === 0) return //if all projects were removed, then don't try to iterate over non-existent tasks
    //If "All tasks" are selected, render all tasks with data attributes to keep the tasks' order when deleting them.
    if(projectIndex === "allTasks") {
        for(let i=0; i < projects.projectList.length; i++){
            for(let j=0; j < projects.projectList[i].tasks.length; j++) {
                taskContainer.innerHTML += 
                `<div class="task-item-container" 
                    data-parent-project-index = ${projects.projectList[i].tasks[j].parentProjectIndex} 
                    data-task-index = ${j}>
                    <button class="task-btn"> ${projects.projectList[i].tasks[j].title}</button>
                    <div>
                        <button class="task-date">${projects.projectList[i].tasks[j].date}</button>
                        <button class="remove-task-btn">remove</button>
                    </div>
                </div>`
            }
        }
    } else {
        projectTitle.textContent = projects.projectList[projectIndex].title
        for(let i = 0; i < projects.projectList[projectIndex].tasks.length; i++){
        taskContainer.innerHTML += 
            `<div class="task-item-container">
            <button class="task-btn"> ${projects.projectList[projectIndex].tasks[i].title}</button>
            <div>
                <button class="task-date">${projects.projectList[projectIndex].tasks[i].date}</button>
                <button class="remove-task-btn">remove</button>
            </div>
            </div>`
        }
    }
    //Remove tasks
    const taskRemoveButtons = document.querySelectorAll(".remove-task-btn")
    taskRemoveButtons.forEach((btn, taskIndex) => {
        btn.addEventListener("click", (e)=>{
            let projectListItem2 = e.target.closest(".task-item-container") // Find the btn's container element: ".list-item-container"
            //If you remove a task from "All tasks", use data attributes to modify the projectList. 
            if(projectIndex === "allTasks") { 
                projects.removeTask("allTasks", projectListItem2.dataset.taskIndex, projectListItem2.dataset.parentProjectIndex) 
                renderTasks("allTasks")
            } else {
                projects.removeTask(selectedProjectIndex, taskIndex)
            }
            projectListItem2.remove()
        })
    })
}

//Add new task form
const titleInput = document.querySelector("#title")
const dateInput = document.querySelector("#date")

const taskForm = document.querySelector("#task-form")
taskForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    //if user doesn't specify a date, set it to "no date", else, use the dateInput's value
    let taskDate = dateInput.value;
    if (taskDate === "") {
        taskDate = "no date";
    }
    projects.addTask(titleInput.value, taskDate, selectedProjectIndex)
    taskForm.reset()
    renderProjects()
    renderTasks(selectedProjectIndex)
})
//Add new project form
const projectTitleInput = document.querySelector("#project-title")
const projectForm = document.querySelector("#project-form")
projectForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    projects.addProject(projectTitleInput.value)
    renderProjects()
    renderTasks(selectedProjectIndex)
})

renderProjects() //Display the default projects in the projectList array when the page loads