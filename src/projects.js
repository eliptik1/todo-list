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
            //Assign each task their parent project's index
            projectList.forEach((project, index) => project.tasks.forEach(task => { task["parentProjectIndex"] = index }))
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
        removeTask(projectIndex, taskIndex, parentProjectIndex){
            if(projectIndex === "allTasks") {
                projectList[parentProjectIndex].tasks.splice(taskIndex, 1)
            } else {
                projectList[projectIndex].tasks.splice(taskIndex, 1)
            }
        }
    }
    let projectList = [new Project("first-project"), new Project("second-project"), new Project("third-project"),new Project("fourth-project")];
    const myProject = new Project()

    projectList[0].tasks.push(new Task("first"))
    projectList[1].tasks.push(new Task("second"))
    projectList[2].tasks.push(new Task("third"))
    projectList[3].tasks.push(new Task("fourth"))
    projectList.forEach((project, index) => project.tasks.forEach(task => { task["parentProjectIndex"] = index }))

    return {
        myProject,
        projectList, 
        addTask: myProject.addTask, 
        addProject:myProject.addProject,
        removeProject: myProject.removeProject,
        removeTask: myProject.removeTask
    }
})() 