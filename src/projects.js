import { Task } from "./task";

export const projects = (() => {

    
    class Project {
        constructor(title = "default"){
            this.title = title
            this.tasks = []
        }
        addTask(title, date){
            const newTask = new Task(title, date)
            //if there is no any project yet, and you add a task, it creates "default" project and put the task in it.
            if(projectList.length === 0){ 
                this.addProject("default")
                projectList[0].tasks.push(newTask)
                console.log(projectList[0].tasks)
            } else {
                projectList[0].tasks.push(newTask)
                console.log(projectList[0].tasks)
            }
            console.log(projectList)
        }
        addProject(title){
            const newProject = new Project(title)
            projectList.push(newProject)
            console.log(projectList)
        }
        removeProject(index){
            projectList.splice(index, 1)
            console.log(projectList)
        }
        removeTask(index){
            projectList[0].tasks.splice(index, 1)
            console.log(projectList[0].tasks)
        }
    }
    let projectList = [new Project("first-project"), new Project("second-project")];
    const myProject = new Project()

    return {
        myProject,
        projectList, 
        addTask: myProject.addTask, 
        addProject:myProject.addProject,
        removeProject: myProject.removeProject,
        removeTask: myProject.removeTask
    }
})() 