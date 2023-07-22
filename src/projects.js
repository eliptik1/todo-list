import { Task } from "./task";

export const projects = (() => {

    class Project {
        constructor(title){
            this.title = title
            this.tasks = []
        }
        addTask(title, date, projectIndex){
            const newTask = new Task(title, date)
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
    }

    //Default projects and tasks
    let projectList = [new Project("first-project"), new Project("second-project"), new Project("third-project"),new Project("fourth-project")];
    const myProject = new Project()
    
    projectList[0].tasks.push(new Task("first", "2023-07-24"))
    projectList[0].tasks.push(new Task("first-2", "2023-07-20"))
    projectList[1].tasks.push(new Task("second", "2023-07-23"))
    projectList[2].tasks.push(new Task("third", "2023-07-22"))
    projectList[3].tasks.push(new Task("fourth", "2023-07-21"))
    //Assign each task their parent project's index & task index
    projectList.forEach((project, index) => project.tasks.forEach(task => { task["parentProjectIndex"] = index }))
    projectList.forEach(project => project.tasks.forEach((task, index) => { task["taskIndex"] = index }))

    //Combine all tasks from all projects in the projectList array into a single array
    let getAllTasks = () => projectList.reduce((acc, project)=> acc.concat(project.tasks), []) 

    return {
        myProject,
        projectList,
        get allTasks() { return getAllTasks() },
        addTask: myProject.addTask, 
        addProject:myProject.addProject,
        removeProject: myProject.removeProject,
        removeTask: myProject.removeTask
    }
})() 