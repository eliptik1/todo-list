import { Task } from "./task";

export const projects = (() => {

    
    class Project {
        constructor(title){
            this.title = title
            this.tasks = []
        }
        addTask(title, date, projectIndex){
            const newTask = new Task(title, date)
            //if there is no any project yet, and you add a task, it creates "default" project and put the task in it.
            if(projectList.length === 0){ 
                this.addProject("default")
                projectList[0].tasks.push(newTask)
                console.log(projectList[0].tasks)
            } else {
                projectList[projectIndex].tasks.push(newTask)
                console.log(projectList[projectIndex].tasks)
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
        removeTask(projectIndex, taskIndex){
            projectList[projectIndex].tasks.splice(taskIndex, 1)
            console.log(projectList[projectIndex].tasks)
        }
    }
    let projectList = [new Project("first-project"), new Project("second-project"), new Project("third-project"),new Project("fourth-project")];
    const myProject = new Project()
    projectList[0].tasks.push({title: "first"})
    projectList[1].tasks.push({title: "second"})
    projectList[2].tasks.push({title: "third"})
    projectList[3].tasks.push({title: "fourth"})

    return {
        myProject,
        projectList, 
        addTask: myProject.addTask, 
        addProject:myProject.addProject,
        removeProject: myProject.removeProject,
        removeTask: myProject.removeTask
    }
})() 