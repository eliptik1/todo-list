import { Task } from "./task";
import { format, isThisWeek, add, parseISO } from "date-fns"

export const projects = (() => {

    class Project {
        constructor(title){
            this.title = title
            this.tasks = []
        }
        addTask(title, date, priority, projectIndex){
            const newTask = new Task(title, date, priority)
            projectList[projectIndex].tasks.push(newTask)
            //Assign each task their parent project's index & task index
            projectList.forEach((project, index) => project.tasks.forEach(task => { task["parentProjectIndex"] = index }))
            projectList.forEach(project => project.tasks.forEach((task, index) => { task["taskIndex"] = index }))         
        }
        addProject(title){
            const newProject = new Project(title)
            projectList.push(newProject)
        }
        removeProject(index){
            projectList.splice(index, 1)
            //Re-assign each task their parent project's index after removing a parent object
            projectList.forEach((project, index) => project.tasks.forEach(task => { task["parentProjectIndex"] = index }))
        }
        removeTask(taskIndex, parentProjectIndex){
            projectList[parentProjectIndex].tasks.splice(taskIndex, 1)
            //Re-assign each task index after removing a task
            projectList.forEach(project => project.tasks.forEach((task, index) => { task["taskIndex"] = index }))
        }
        editProject(index, newTitle){
            projectList[index].title = newTitle
        }
        editTask(projectIndex, taskIndex, newTitle, newDate, newPriority){
            projectList[projectIndex].tasks[taskIndex].title = newTitle
            projectList[projectIndex].tasks[taskIndex].date = newDate
            projectList[projectIndex].tasks[taskIndex].priority = newPriority
        }
        checkTask(projectIndex, taskIndex){
            projectList[projectIndex].tasks[taskIndex].checked === false ? 
                projectList[projectIndex].tasks[taskIndex].checked = true :
                projectList[projectIndex].tasks[taskIndex].checked = false
        }
        setPriority(projectIndex, taskIndex, value){
            projectList[projectIndex].tasks[taskIndex].priority = value
        }
    }

    //Default projects and tasks
    let projectList = [new Project("first-project"), new Project("second-project"), new Project("third-project"),new Project("fourth-project")];
    const myProject = new Project()
    
    projectList[0].tasks.push(new Task("first", "2023-07-24", "low"))
    projectList[0].tasks.push(new Task("first-2", "2023-07-20", "high"))
    projectList[1].tasks.push(new Task("second", "2023-07-23"))
    projectList[2].tasks.push(new Task("third", "2023-07-22", "medium"))
    projectList[3].tasks.push(new Task("fourth", "2023-07-21", "low"))
    //Assign each task their parent project's index & task index
    projectList.forEach((project, index) => project.tasks.forEach(task => { task["parentProjectIndex"] = index }))
    projectList.forEach(project => project.tasks.forEach((task, index) => { task["taskIndex"] = index }))
    //Combine all tasks from all projects in the projectList array into a single array
    let getAllTasks = () => {
        const allTasks = projectList.reduce((acc, project)=> acc.concat(project.tasks), []);
        allTasks.sort((a,b)=>a.date < b.date ? -1 : 1)
        //order tasks by their checked state
        return allTasks.filter(task => task.checked != true).concat(allTasks.filter(task => task.checked === true))
    }
    let getTodayTasks = () => {
        return getAllTasks().filter(task => task.date === today)
    }
    let getWeekTasks = () => {
        return getAllTasks().filter(task => isThisWeek(parseISO(task.date)))
    }

    let getProjectList = () => {
        return projectList
    }
    let setProjectList = (newList) => {
        projectList = newList;
    }
    
    //Date variables
    const date = new Date()
    const today = format(date, 'yyyy-MM-dd')
    const tomorrow = format(add(new Date(), {days:1}), "yyyy-MM-dd")
    const nextWeek = format(add(new Date(), {weeks:1}), "yyyy-MM-dd")

    return {
        myProject,
        today,
        tomorrow,
        nextWeek,
        get projectList() { return getProjectList() },
        set projectList(newList) { setProjectList(newList) },
        get allTasks() { return getAllTasks() },
        get todayTasks() { return getTodayTasks() },
        get weekTasks() { return getWeekTasks() },
        addTask: myProject.addTask, 
        addProject:myProject.addProject,
        removeProject: myProject.removeProject,
        removeTask: myProject.removeTask,
        editProject:myProject.editProject,
        editTask: myProject.editTask,
        checkTask: myProject.checkTask,
        setPriority: myProject.setPriority
    }
})() 