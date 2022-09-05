//const key = "tasks";

export interface Task {
    id: number,
    category?: string | null,
    text?: string,
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

// export class localStorageCalendar implements Calendar {
//     namespace: string;
//     task: Task;

//     constructor(task: Task,namespace:string) {
//         this.task = task;
//         this.namespace=namespace;
//     }

//     async createTask(task: Task,namespace:string) {
//         const items=this.readAllTasks(namespace);
//         const result = items.find(function (item) {
//             return item.id === task.id;
//         })        

//         if (result === undefined) {            
//             items.push(task);            
//             localStorage.setItem(namespace, JSON.stringify(items));
//         }
//         return items;
//     }

//     async readAllTasks(namespace:string) {        
//         const items = localStorage.getItem(namespace) as string;       
//         console.log('readAllTasks items=',items) 
//         return items === null ? [] : JSON.parse(items);
//     }

//     async readTask(id: number,namespace:string) {        
//         const values = localStorage.getItem(namespace);
//         if (values === null) return [];

//         const items = JSON.parse(values);        

//         for (let i = 0; i < items.length; i++) {
//             if (items[i].id === id) return items[i];
//         }        
//         return [];
//     }

//     async updateTask(task: Task,namespace:string) {
//         const items= this.readAllTasks(namespace);    
//         items.find(function (item: Task) {
//             if (item.id === task.id) {                                

//                 for (const k in task) {                    
//                     if (k in item) {
//                         item[k] = task[k]
//                     }
//                 }
//                 return true;
//             }
//             return false;
//         })

//         localStorage.setItem(namespace, JSON.stringify(items));
//         return items;
//     }

//     async deleteTask(id: number,namespace:string) {
//         const values = localStorage.getItem(namespace);        
//         if (values === null) return [];
//         const items: Task[] = JSON.parse(values);

//         for (let i = 0; i < items.length; i++) {
//             if (items[i].id === id) {                
//                 items.splice(i, 1);                          
//             }
//         }
//         localStorage.setItem(namespace, JSON.stringify(items));
//         return items        
//     }

//     async sortTask(field: string | number,namespace:string) {
//         const values = localStorage.getItem(namespace);        
//         if (values === null) return [];

//         const items: Task[] = JSON.parse(values);        

//         if (field === 'date') {
//             items.sort(function (a: Task, b: Task) {
//                 return (new Date(a.date).getTime() - new Date(b.date).getTime());
//             });

//         }

//         else {
//             items.sort((prev, next) => {
//                 if ((prev && next) !== null) {                    
//                     if (prev[field] < next[field]) return -1;
//                     if (prev[field] < next[field]) return 1;
//                 }
//                 return 1;
//             });
//         }        

//         localStorage.setItem(namespace, JSON.stringify(items));
//         return items;
//     }
// }

export class remoteStorageCalendar implements Calendar {
    namespace: string;
    task: Task;

    constructor(task: Task, namespace: string) {
        this.task = task;
        this.namespace = namespace;
    }

    async createTask(task: Task, namespace: string) {
        const items = await this.readAllTasks(namespace);
        console.log("createTask items", items);     
        const result = items.find(function (item) {
            return item.id === task.id;
        })

        if (result === undefined) {
            items.push(task);
            //localStorage.setItem(namespace, JSON.stringify(items));
        }
        let response = await fetch('/article/fetch/post/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(task)
        });
        let result = await response.json();
        return items;
    }

    async readAllTasks(namespace: string) {
        const url = `https://crudcrud.com/api/b6d6d59df9494ea0936b15dea5371496`;
        let response = await fetch(url);
        let items = await response.json();
        console.log('type of items=', typeof items);
        console.log('items=', items);
        return items.length === 0 ? [] : JSON.parse(items);
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
        const items = this.readAllTasks(namespace);


        // items.find(function (item: Task) {
        //     if (item.id === task.id) {                                

        //         for (const k in task) {                    
        //             if (k in item) {
        //                 item[k] = task[k]
        //             }
        //         }
        //         return true;
        //     }
        //     return false;
        // })

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