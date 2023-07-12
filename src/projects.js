import { Task } from "./task";

export const projects = (() => {

    let projectList = [];
    class Project {
        constructor(title){
            this["project title"] = title
            this.tasks = []
        }
        addTask(title, date){
            const newTask = new Task(title, date)
            myProject.tasks.push(newTask)
        }
    }

    const myProject = new Project("default")

    return {myProject, addTask: myProject.addTask}
})() 