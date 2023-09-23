import { projects } from "./projects"
import { format, parseISO, isThisYear } from "date-fns"

const projectTitle = document.querySelector(".project-title")
const titleIcon = document.querySelector("#title-icon")

const allBtn = document.querySelector("#all-btn")
const todayBtn = document.querySelector("#today-btn")
const weekBtn = document.querySelector("#week-btn")

export const createDOM = () => {
    displayTab("allTasks", "All tasks", "stack")
    renderProjects() //Display the current projects in the projectList array when the page loads
}

//Local storage
if(!localStorage.getItem("todoList")) {
    saveToLocalStorage();
} else {
    loadFromLocalStorage();
}
function saveToLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(projects.projectList));
    loadFromLocalStorage();
}
function loadFromLocalStorage() {
    let storedProjectList = JSON.parse(localStorage.getItem("todoList"))
    projects.projectList = storedProjectList;
}

//Navbar buttons
allBtn.addEventListener("click", ()=> displayTab("allTasks", "All tasks", "stack"))
todayBtn.addEventListener("click", ()=> displayTab("today", "Today", "star"))
weekBtn.addEventListener("click", ()=> displayTab("week", "This week", "calendar"))

function displayTab(tabName, tabTitle, tabIcon){
    projectTitle.textContent = tabTitle
    titleIcon.src = `./assets/${tabIcon}.svg`
    renderTasks(tabName)
    selectProject(tabName)
    taskForm.classList.add("hidden")
}

//Select project
let selectedProjectIndex = 0
function selectProject(index){
    selectedProjectIndex = index
    //Making selected button active
    const projectButtons = document.querySelectorAll(".project-btn")
    const navButtons = document.querySelectorAll(".nav-btn")
    projectButtons.forEach(btn => btn.classList.remove("active")) //clear all active buttons when selecting a project
    navButtons.forEach(btn => btn.classList.remove("active")) //clear all active buttons when selecting a nav button
    if(projectButtons.length !=0 && Number.isInteger(index)) { //If all projects are not removed & project index is a number
        projectButtons[selectedProjectIndex].classList.add("active");
        openTaskFormBtn.classList.remove("hidden")
    } else {
        openTaskFormBtn.classList.add("hidden")
        if(index === "allTasks") navButtons[0].classList.add("active"); //Make "allTasks" button active since it's already selected
        if(index === "today") navButtons[1].classList.add("active"); //Keep "today" button active while creating a project when it's selected
        if(index === "week") navButtons[2].classList.add("active"); //Keep "week" button active while creating a project when it's selected
    }
}


function removeAndUpdateSelection(index) {
    const projectRemoveButtons = document.querySelectorAll(".project-btn .remove-btn")
    projects.removeProject(index)
    renderProjects()
    saveToLocalStorage();
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
        displayTab("allTasks", "All tasks", "stack")
        selectProject("allTasks")
    }
}

function renderProjects(){
    const projectContainer = document.querySelector(".project-list")
    projectContainer.innerHTML = "" // clear existing projects display when calling the function more than once
    for(let i = 0; i < projects.projectList.length; i++){
        projectContainer.innerHTML += 
        `<div class="project-btn" data-project-index = ${i} >
            <button>
                <div class="btn-container">
                    <img id="box" src="./assets/box.svg" alt="Project">
                    <div> ${projects.projectList[i].title}</div>
                </div>
            </button>
            <div class="edit-container">
                <button class="edit-btn"><img src="./assets/edit.svg"></button>
                <button class="remove-btn"><img src="./assets/remove.svg"></button>
            </div>
        </div>`
    }
    //Remove projects
    const projectRemoveButtons = document.querySelectorAll(".project-btn .remove-btn")
    projectRemoveButtons.forEach((btn, index) => {
        btn.addEventListener("click", (e)=>{
            editProjectForm.classList.add("hidden")
            editTaskForm.classList.add("hidden")
            deleteTaskForm.classList.add("hidden")
            deleteProjectForm.classList.remove("hidden")
            modalOn()
            modalTitle.textContent = "Delete Project"
            deleteProjectModalTitle.textContent = `${projects.projectList[index].title}`
            deleteProjectForm.onsubmit = () => removeAndUpdateSelection(index)
            e.stopPropagation();     
        })
    })
    //View selected project
    const projectButtons = document.querySelectorAll(".project-btn")
    projectButtons.forEach((btn, index)=> {
        btn.addEventListener("click", () => {
            selectProject(index)
            renderTasks(selectedProjectIndex)
            titleIcon.src = `./assets/box.svg`
            projectButtons[index].classList.add("active")
        })
    })
    const navButtons = document.querySelectorAll(".nav-btn")
    navButtons.forEach((btn, index) => {
        btn.addEventListener("click", ()=> {
            navButtons.forEach(btn => btn.classList.remove("active")) //clear all active buttons when selecting a nav button
            navButtons[index].classList.add("active")})
        })

    //Edit project title
    const editProjectButtons = document.querySelectorAll(".project-btn .edit-btn")
    editProjectButtons.forEach((btn, index)=> {
        btn.addEventListener("click", (e) => {
            editProjectForm.classList.remove("hidden")
            editTaskForm.classList.add("hidden")
            deleteProjectForm.classList.add("hidden")
            deleteTaskForm.classList.add("hidden")
            let projectListItem = e.target.closest(".project-btn")
            projectListItem.classList.add("edit-active")
            projectEditTitleInput.value = projects.projectList[index].title
            projectEditTitleInput.focus()
            e.stopPropagation();
            //Modal action
            modalOn()
            modalTitle.textContent = "Edit Project"
        })
    })
} 
const today = format(new Date(), 'yyyy-MM-dd')
function renderTasks(projectIndex){
    const taskContainer = document.querySelector(".task-list")
    taskContainer.innerHTML = "" // clear existing tasks display when calling the function more than once

    if(projects.projectList.length === 0) return //if all projects were removed, then don't try to iterate over non-existent tasks
    function render(tabArray){
        for(let i=0; i < tabArray.length; i++){
            taskContainer.innerHTML += 
            `<div class="task-item-container ${tabArray[i].checked ? "checked" : ""}" 
            data-parent-project-index = ${tabArray[i].parentProjectIndex} 
            data-task-index = ${tabArray[i].taskIndex}>
                <div class="checkbox-container">
                    <input type="checkbox" class="task-checkbox ${tabArray[i].priority}" name="check" ${tabArray[i].checked ? "checked" : ""}>
                    <div class="task-title"> ${tabArray[i].title}<br>
                    <span class="parent-title">(${projects.projectList[tabArray[i].parentProjectIndex].title})</span>
                    </div>
                </div>
                <div class="task-btns-container">
                    <div class="task-priority">${tabArray[i].priority}</div>
                    <div class="task-date ${tabArray[i].date < today ? "outdated" : ""}">
                    ${
                        (()=> {
                        if(tabArray[i].date !=="no date" && !isThisYear(parseISO(tabArray[i].date))){
                            return format(parseISO(tabArray[i].date), 'd MMM yyyy');
                        } else if(isThisYear(parseISO(tabArray[i].date))) { 
                            return format(parseISO(tabArray[i].date), 'd MMM');
                        } else {
                            return "no date"
                        }
                        })()
                    }
                    </div>
                    <div class="edit-container">
                        <button class="task-edit-btn edit-btn"><img src="./assets/edit.svg"></button>
                        <button class="remove-task-btn remove-btn"><img src="./assets/remove.svg"></button>
                    <div>
                </div>
            </div>`
            
            //Display parent projects' titles along with the tasks when rendering Home tabs
            const parentTitles = document.querySelectorAll(".parent-title");
            for (const parentTitle of parentTitles) {
                if (projects.projectList.length !== 0 && Number.isInteger(projectIndex)) {
                // If projects exist and projectIndex is a valid integer
                parentTitle.classList.add("hidden");
                } else {
                parentTitle.classList.remove("hidden");
                }
            }
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
    const taskRemoveButtons = document.querySelectorAll(".task-btns-container .remove-task-btn")
    taskRemoveButtons.forEach( btn => {
        btn.addEventListener("click", (e)=>{
            editProjectForm.classList.add("hidden")
            editTaskForm.classList.add("hidden")
            deleteProjectForm.classList.add("hidden")
            deleteTaskForm.classList.remove("hidden")
            modalOn()
            modalTitle.textContent = "Delete Task"
            let taskListItem = e.target.closest(".task-item-container")
            taskListItem.classList.add("edit-active")
            deleteTaskModalTitle.textContent = `'${projects.projectList[taskListItem.dataset.parentProjectIndex].tasks[taskListItem.dataset.taskIndex].title}'`
            deleteTaskForm.onsubmit = () => {
                //use data attributes to modify the projectList. 
                projects.removeTask(taskListItem.dataset.taskIndex, taskListItem.dataset.parentProjectIndex) 
                if(projectIndex === "allTasks") { 
                    renderTasks("allTasks")
                } else {
                    renderTasks(selectedProjectIndex)
                }
                taskListItem.remove()
                saveToLocalStorage();
            }
            e.stopPropagation(); 
        })
    })
    //Edit task
    const editTaskButtons = document.querySelectorAll(".task-edit-btn")
    editTaskButtons.forEach(btn=> {
        btn.addEventListener("click", (e) => {
            editTaskForm.classList.remove("hidden")
            deleteTaskForm.classList.add("hidden")
            let taskListItem = e.target.closest(".task-item-container")
            taskListItem.classList.add("edit-active")
            taskEditTitleInput.value = projects.projectList[taskListItem.dataset.parentProjectIndex].tasks[taskListItem.dataset.taskIndex].title
            priorityEditInput.value = projects.projectList[taskListItem.dataset.parentProjectIndex].tasks[taskListItem.dataset.taskIndex].priority
            projects.projectList[taskListItem.dataset.parentProjectIndex].tasks[taskListItem.dataset.taskIndex].date == "no date" ? 
                taskEditDateInput.value = "" : 
                taskEditDateInput.value = projects.projectList[taskListItem.dataset.parentProjectIndex].tasks[taskListItem.dataset.taskIndex].date
            taskEditTitleInput.focus()
            //Modal action
            modalOn()
            modalTitle.textContent = "Edit Task"
        })
    })
    //Check task
    const checkTaskButtons = document.querySelectorAll(".task-checkbox")
    checkTaskButtons.forEach(checkbox=>{
        checkbox.addEventListener("click", (e) => {
            let taskListItem = e.target.closest(".task-item-container")
            projects.checkTask(taskListItem.dataset.parentProjectIndex, taskListItem.dataset.taskIndex)
            renderTasks(selectedProjectIndex)
            saveToLocalStorage();
        })
    })
}

//Add new task form
const titleInput = document.querySelector("#title")
const dateInput = document.querySelector("#date")
const dateToday = document.querySelector("#date-today")
const dateTomorrow = document.querySelector("#date-tomorrow")
const dateNextWeek = document.querySelector("#date-next-week")
const taskForm = document.querySelector("#task-form")
const prioritySelection = document.querySelector("#priority") 
const openTaskFormBtn = document.querySelector("#open-task-form")
function showTaskForm(){
    taskForm.classList.remove("hidden")
    openTaskFormBtn.classList.add("hidden")
}
function hideTaskForm(){
    taskForm.classList.add("hidden")
    openTaskFormBtn.classList.remove("hidden")
}
openTaskFormBtn.addEventListener("click", (e)=> {
    showTaskForm()
    titleInput.focus()
})
// Hide the task form when clicking outside the form
document.addEventListener('mousedown', (e) => {
    //if the clicked element is not a part of the form or its children && any project(not home tabs) is selected
    if (!taskForm.contains(e.target) && Number.isInteger(selectedProjectIndex)) {
        hideTaskForm();
    }
});
//Choose date with buttons
dateToday.addEventListener("click", (e)=> {
    e.preventDefault()
    dateInput.value = projects.today
})
dateTomorrow.addEventListener("click", (e)=> {
    e.preventDefault()
    dateInput.value = projects.tomorrow
})
dateNextWeek.addEventListener("click", (e)=> {
    e.preventDefault()
    dateInput.value = projects.nextWeek
})
taskForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    //if user doesn't specify a date, set it to "no date", else, use the dateInput's value
    let taskDate = dateInput.value;
    if (taskDate === "") {
        taskDate = "no date";
    }
    projects.addTask(titleInput.value, taskDate, prioritySelection.value, selectedProjectIndex)
    taskForm.reset()
    hideTaskForm();
    saveToLocalStorage();
    renderTasks(selectedProjectIndex)
})

//Add new project form
const projectTitleInput = document.querySelector("#project-title")
const projectForm = document.querySelector("#project-form")
const openProjectFormBtn = document.querySelector("#open-project-form")
function showProjectForm(){
    projectForm.classList.remove("hidden")
    openProjectFormBtn.classList.add("hidden")
}
function hideProjectForm(){
    projectForm.classList.add("hidden")
    openProjectFormBtn.classList.remove("hidden")
}
openProjectFormBtn.addEventListener("click", (e)=> {
    showProjectForm()
    projectTitleInput.focus()
})
// Hide the project form when clicking outside the form
document.addEventListener('mousedown', (e) => {
    //if the clicked element is not a part of the form or its children
    if (!projectForm.contains(e.target)) {
        hideProjectForm();
    }
});
projectForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    projects.addProject(projectTitleInput.value)
    projectTitleInput.value = ""
    hideProjectForm();
    renderProjects()
    saveToLocalStorage()
    renderTasks(selectedProjectIndex)
    selectProject(selectedProjectIndex)
})

//Edit project form
const editProjectForm = document.querySelector("#edit-project-form")
editProjectForm.classList.add("hidden") //hide form when the page loads
const projectEditTitleInput = document.querySelector("#edit-project-title")
const cancelBtn = document.querySelector("#form-btn-cancel")
editProjectForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    const selectedItem = document.querySelector(".edit-active")
    if(selectedItem) {
        projects.editProject(selectedItem.dataset.projectIndex, projectEditTitleInput.value)
        renderProjects()
        saveToLocalStorage();
        renderTasks(selectedProjectIndex)
        selectProject(selectedProjectIndex)
        projectEditTitleInput.value = ""
    }
    editProjectForm.classList.add("hidden")
    deleteTaskForm.classList.add("hidden")
    modalOff()
})
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault()
    projectEditTitleInput.value = ""
    const projectListItems = document.querySelectorAll(".project-btn")
    projectListItems.forEach(item => item.classList.remove("edit-active"))
    editProjectForm.classList.add("hidden")
    modalOff()
})

//Edit task form
const editTaskForm = document.querySelector("#edit-task-form")
const taskEditTitleInput = document.querySelector("#edit-task-title")
const taskEditDateInput = document.querySelector("#edit-date")
const taskCancelBtn = document.querySelector("#task-form-btn-cancel")
const priorityEditInput = document.querySelector("#edit-priority")
const taskEditDateToday = document.querySelector("#edit-date-today")
const taskEditDateTomorrow = document.querySelector("#edit-date-tomorrow")
const taskEditDateNextWeek = document.querySelector("#edit-date-next-week")
editTaskForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    let newDate = taskEditDateInput.value;
    (newDate === "") ? newDate = "no date" : newDate = taskEditDateInput.value
    const selectedItem = document.querySelector(".edit-active")
    if(selectedItem) {
        projects.editTask(selectedItem.dataset.parentProjectIndex, selectedItem.dataset.taskIndex, taskEditTitleInput.value, newDate, priorityEditInput.value)
        saveToLocalStorage();
        renderTasks(selectedProjectIndex)
    }
    editTaskForm.classList.add("hidden")
    deleteProjectForm.classList.add("hidden")
    editTaskForm.reset()
    modalOff()
})
taskCancelBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const taskListItems = document.querySelectorAll(".task-item-container")
    taskListItems.forEach(item => item.classList.remove("edit-active"))
    editTaskForm.classList.add("hidden")
    modalOff()
})
//Choose date with buttons
taskEditDateToday.addEventListener("click", (e)=> {
    e.preventDefault()
    taskEditDateInput.value = projects.today
})
taskEditDateTomorrow.addEventListener("click", (e)=> {
    e.preventDefault()
    taskEditDateInput.value = projects.tomorrow
})
taskEditDateNextWeek.addEventListener("click", (e)=> {
    e.preventDefault()
    taskEditDateInput.value = projects.nextWeek
})

//Delete project form
const deleteProjectForm = document.querySelector("#delete-project-form")
const deleteProjectModalTitle = document.querySelector("#delete-project-form span")
const cancelDeleteBtn = document.querySelector("#form-delete-project-cancel")
deleteProjectForm.classList.add("hidden")
deleteProjectForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    const selectedItem = document.querySelector(".edit-active")
    if(selectedItem) {
        projects.removeProject(selectedItem.dataset.projectIndex)
        renderProjects()
        saveToLocalStorage();
        renderTasks(selectedProjectIndex)
    }
    editProjectForm.classList.add("hidden")
    modalOff()
})
cancelDeleteBtn.addEventListener("click", (e) => {
    e.preventDefault()
    projectEditTitleInput.value = ""
    const projectListItems = document.querySelectorAll(".project-btn")
    projectListItems.forEach(item => item.classList.remove("edit-active"))
    editProjectForm.classList.add("hidden")
    modalOff()
})

//Delete task form
const deleteTaskForm = document.querySelector("#delete-task-form")
const deleteTaskModalTitle = document.querySelector("#delete-task-form span")
const cancelDeleteTaskBtn = document.querySelector("#form-delete-task-cancel")
deleteTaskForm.classList.add("hidden")
deleteTaskForm.addEventListener("submit", (e)=> {
    e.preventDefault()
    editTaskForm.classList.add("hidden")
    modalOff()
})

cancelDeleteTaskBtn.addEventListener("click", (e) => {
    e.preventDefault()
    editTaskForm.classList.add("hidden")
    modalOff()
})

//Modal window
const modalTitle = document.querySelector("#modal-title")
function modalOn(){
    modal.classList.add("active")
    overlay.classList.add("active")
    overlay.addEventListener("click", ()=> {
        modalOff()
    })
}
function modalOff(){
    modal.classList.remove("active")
    overlay.classList.remove("active")
    editProjectForm.classList.add("hidden")
    editTaskForm.classList.add("hidden")
    deleteProjectForm.classList.add("hidden")
    deleteTaskForm.classList.add("hidden")
    const projectListItems = document.querySelectorAll(".project-btn")
    const taskListItems = document.querySelectorAll(".task-item-container")
    projectListItems.forEach(item => item.classList.remove("edit-active"))
    taskListItems.forEach(item => item.classList.remove("edit-active"))
}

const modal = document.querySelector(".modal")
const overlay = document.querySelector("#overlay")
const menuOverlay = document.querySelector("#menu-overlay")

//Hamburger menu
const hamburgerMenu = document.querySelector("#burger")
const menuContainer = document.querySelector(".left-panel-container")

hamburgerMenu.addEventListener("click", (e) => {
    if(e.target.checked == true) {
        menuContainer.classList.add("active"); 
        menuOn()
    } else {
        menuOff()
    }
})

function menuOn(){
    menuOverlay.classList.add("active")
    hamburgerMenu.checked
    menuOverlay.addEventListener("click", closeMenu)
}
function menuOff(){
    menuOverlay.classList.remove("active")
    menuContainer.classList.remove("active")
}
function closeMenu() {
    menuOverlay.removeEventListener("click", closeMenu); // Remove the event listener after the menu is closed
    hamburgerMenu.checked = false
    menuOff();
}