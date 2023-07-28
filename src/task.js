export class Task {
    constructor(title, date="no date", priority="-", checked=false) {
        this.title = title;
        this.date = date;
        this.priority = priority;
        this.checked = checked;
    }
}