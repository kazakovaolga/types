const key = "tasks";

export interface Task {
    id: number,
    category?: string | null,
    text?: string,
    date: Date
};

export class Calendar {
    task: Task;

    constructor(task: Task) {
        this.task = task;
    }

    createTask(task: Task) {
        const items: Task[] = this.readAllTasks();
        const result = items.find(function (item) {
            return item.id === task.id;
        })        

        if (result === undefined) {            
            items.push(task);            
            localStorage.setItem(key, JSON.stringify(items));
        }
        return items;
    }

    readAllTasks() {        
        const items = localStorage.getItem(key) as string;        
        return items === null ? [] : JSON.parse(items);
    }

    readTask(id: number) {        
        const values = localStorage.getItem(key);
        if (values === null) return [];

        const items = JSON.parse(values);        

        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) return items[i];
        }        
        return [];
    }

    updateTask(task: Task) {
        const items: Task[] = this.readAllTasks();
        

        items.find(function (item: Task) {
            if (item.id === task.id) {                                

                for (const k in task) {                    
                    if (k in item) {
                        item[k] = task[k]
                    }
                }
                return true;
            }
            return false;
        })

        localStorage.setItem(key, JSON.stringify(items));
        return items;
    }

    deleteTask(id: number) {
        const values = localStorage.getItem(key);        
        if (values === null) return [];
        const items: Task[] = JSON.parse(values);

        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) {                
                items.splice(i, 1);                          
            }
        }
        localStorage.setItem(key, JSON.stringify(items));
        return items        
    }

    sortTask(field: string | number) {
        const values = localStorage.getItem(key);        
        if (values === null) return [];

        const items: Task[] = JSON.parse(values);        

        if (field === 'date') {
            items.sort(function (a: Task, b: Task) {
                return (new Date(a.date).getTime() - new Date(b.date).getTime());
            });

        }

        else {
            items.sort((prev, next) => {
                if ((prev && next) !== null) {                    
                    if (prev[field] < next[field]) return -1;
                    if (prev[field] < next[field]) return 1;
                }
                return 1;
            });
        }        

        localStorage.setItem(key, JSON.stringify(items));
        return items;
    }
}