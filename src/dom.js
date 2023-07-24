import { projects } from "./projects"
const projectTitle = document.querySelector(".project-title")

const allBtn = document.querySelector("#all-btn")
const todayBtn = document.querySelector("#today-btn")
const weekBtn = document.querySelector("#week-btn")

export const createDOM = () => {
    renderTasks(selectedProjectIndex)
}
//Navbar buttons
allBtn.addEventListener("click", ()=> displayTab("allTasks", "All tasks"))
todayBtn.addEventListener("click", ()=> displayTab("today", "Today"))
weekBtn.addEventListener("click", ()=> displayTab("week", "This week"))

function displayTab(tabName, tabTitle){
    projectTitle.textContent = tabTitle
    renderTasks(tabName)
    selectProject(tabName)
    taskForm.classList.add("hidden")
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
        projectContainer.innerHTML += 
        `<div class="list-item-container" data-project-index = ${i} >
        <button class="project-btn"> ${projects.projectList[i].title}</button>
        <div class="edit-container">
            <button class="edit-btn">edit</button>
            <button class="remove-btn">remove</button>
        </div>
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
            } else if(selectedProjectIndex === "today") {
                renderTasks("today")
            } else if(selectedProjectIndex === "week") {
                renderTasks("week")
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
                displayTab("allTasks", "All tasks")
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
    //Edit project title
    const editProjectButtons = document.querySelectorAll(".edit-btn")
    const projectListItems = document.querySelectorAll(".list-item-container")
    editProjectButtons.forEach((btn, index)=> {
        btn.addEventListener("click", (e) => {
            editProjectForm.classList.remove("hidden")
            let projectListItem = e.target.closest(".list-item-container")
            //clear active classes for the purpose of selecting only one list item
            projectListItems.forEach(item => item.classList.remove("edit-active")) 
            projectListItem.classList.add("edit-active")
            projectEditTitleInput.value = projects.projectList[index].title
            projectEditTitleInput.focus()
        })
    })
} 

function renderTasks(projectIndex){
    const taskContainer = document.querySelector(".task-list")
    taskContainer.innerHTML = "" // clear existing tasks display when calling the function more than once
    if(projects.projectList.length === 0) return //if all projects were removed, then don't try to iterate over non-existent tasks
    function render(tabArray){
        for(let i=0; i < tabArray.length; i++){
            taskContainer.innerHTML += 
            `<div class="task-item-container" 
            data-parent-project-index = ${tabArray[i].parentProjectIndex} 
            data-task-index = ${tabArray[i].taskIndex}>
                <button class="task-btn"> ${tabArray[i].title}</button>
                <div>
                    <button class="task-date">${tabArray[i].date}</button>
                    <button class="remove-task-btn">remove</button>
                </div>
            </div>`
        }
    }
    //If "All tasks" are selected, render all tasks with data attributes to keep the tasks' order when deleting them.
    if(projectIndex === "allTasks") {
        render(projects.allTasks)
    } else if(projectIndex === "today"){
        render(projects.todayTasks)
    } else if(projectIndex === "week"){
        render(projects.weekTasks)
    } else {
        projectTitle.textContent = projects.projectList[projectIndex].title
        render(projects.projectList[projectIndex].tasks)
    }
    //Remove tasks
    const taskRemoveButtons = document.querySelectorAll(".remove-task-btn")
    taskRemoveButtons.forEach( btn => {
        btn.addEventListener("click", (e)=>{
            let projectListItem2 = e.target.closest(".task-item-container") // Find the btn's container element: ".list-item-container"
            //use data attributes to modify the projectList. 
            projects.removeTask(projectListItem2.dataset.taskIndex, projectListItem2.dataset.parentProjectIndex) 
            if(projectIndex === "allTasks") { 
                renderTasks("allTasks")
            } else {
                renderTasks(selectedProjectIndex)
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
    projectTitleInput.value = ""
    renderProjects()
    renderTasks(selectedProjectIndex)
})

//Edit project form
const editProjectForm = document.querySelector("#project-edit-form")
editProjectForm.classList.add("hidden") //hide form when the page loads
const projectEditTitleInput = document.querySelector("#project-edit-title")
const cancelBtn = document.querySelector("#form-btn-cancel")
editProjectForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    const selectedItem = document.querySelector(".edit-active")
    if(selectedItem) {
        projects.editProject(selectedItem.dataset.projectIndex, projectEditTitleInput.value)
        renderProjects()
        projectEditTitleInput.value = ""
    }
    editProjectForm.classList.add("hidden")
})
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault()
    projectEditTitleInput.value = ""
    const projectListItems = document.querySelectorAll(".list-item-container")
    projectListItems.forEach(item => item.classList.remove("edit-active"))
    editProjectForm.classList.add("hidden")
})


renderProjects() //Display the default projects in the projectList array when the page loads