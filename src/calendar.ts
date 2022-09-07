export interface Task {
    id: number,
    category: string,
    text?: string | undefined,
    date: Date
};

export interface Calendar {
    createTask(task: Task, namespace: string): Promise<Task[]>,
    readAllTasks(namespace: string): Promise<Task[]>,
    readTask(id: number, namespace: string): Promise<Task[]>,
    updateTask(task: Task, namespace: string): Promise<Task[]>,
    deleteTask(id: number, namespace: string): Promise<Task[]>,
    sortTask(field: string | number, namespace: string): Promise<Task[]>
}

export class localStorageCalendar implements Calendar {
    namespace: string;
    task: Task;

    constructor(task: Task, namespace: string) {
        this.task = task;
        this.namespace = namespace;
    }

    async createTask(task: Task, namespace: string) {
        const items = await this.readAllTasks(namespace);        
        const result = items.find( (item:Task)=> {
            return item.id === task.id;
        })
        
        if (result === undefined) {
            items.push(task);
            localStorage.setItem(namespace, JSON.stringify(items));
        }
        return items;
    }

    async readAllTasks(namespace: string) {
        const items = localStorage.getItem(namespace) as string;        
        return items === null ? [] : JSON.parse(items);
    }

    async readTask(id: number, namespace: string) {
        const values = localStorage.getItem(namespace);
        if (values === null) return [];

        const items = JSON.parse(values);

        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) return items[i];
        }
        return [];
    }

    async updateTask(task: Task, namespace: string) {
        const items = await this.readAllTasks(namespace);
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

        localStorage.setItem(namespace, JSON.stringify(items));
        return items;
    }

    async deleteTask(id: number, namespace: string) {
        const values = localStorage.getItem(namespace);
        if (values === null) return [];
        const items: Task[] = JSON.parse(values);

        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                items.splice(i, 1);
            }
        }
        localStorage.setItem(namespace, JSON.stringify(items));
        return items
    }

    async sortTask(field: string | number, namespace: string) {
        const values = localStorage.getItem(namespace);        
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
        localStorage.setItem(namespace, JSON.stringify(items));
        return items;
    }
}

export class remoteStorageCalendar implements Calendar {
    namespace: string;
    task: Task;

    constructor(task: Task, namespace: string) {
        this.task = task;
        this.namespace = namespace;
    }

    async createTask(task: Task, namespace: string) {
        const items = await this.readAllTasks(namespace);
        const response = await fetch(`https://crudcrud.com/api/f55eb32cdce74cc9a5b0c4be30275dfd/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(task)
        });
        await response.json();        
        return items;
    }

    async readAllTasks(namespace: string) {
        const url = `https://crudcrud.com/api/f55eb32cdce74cc9a5b0c4be30275dfd/`;
        const response = await fetch(url);
        const items = await response.json();
        return items.length === 0 ? [] : items;
    }

    async readTask(id: number, namespace: string) {
        const items = await this.readAllTasks(namespace);

        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) return items[i];
        }
        return [];        
    }

    async updateTask(task: Task, namespace: string) {
        const items = await this.readAllTasks(namespace);
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
        return items;
    }

    async deleteTask(id: number, namespace: string) {
        const items = await this.readAllTasks(namespace);

        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                items.splice(i, 1);
            }
        }        
        return items
    }

    async sortTask(field: string | number, namespace: string) {
        const items = await this.readAllTasks(namespace);

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
        return items;
    }
}