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
        console.log('saveIdTask');
        // console.log('task=', task);

        const items: Task[] = this.readAllTasks();
        // console.log('items=', items);
        // console.log('task.id', task.id);

        const result = items.find(function (item) {
            // console.log('item=', item);
            // console.log('item.id=', item.id);
            // console.log('task.id=', task.id);

            return item.id === task.id;
        })
        // console.log('items=', items);


        if (result === undefined) {
            console.log('does not exists');
            items.push(task);
            // console.log('push items=', items);
            localStorage.setItem(key, JSON.stringify(items));
        }
        return items;
    }

    readAllTasks() {
        console.log('readAllTasks');
        const items = localStorage.getItem(key) as string;
//        console.log('items=', items);
        return items === null ? [] : JSON.parse(items);
    }

    readTask(id: number) {
        console.log('readIdTask');
        // console.log('id=', id);
        const values = localStorage.getItem(key);
        // console.log('typeof values=', typeof values);
        // console.log('values=', values);
        if (values === null) return [];

        const items=JSON.parse(values);
        //console.log('readID items=',items );

        for (let i = 0; i < items.length; i++) {
            // console.log('items[i]=', items[i]);
            // console.log('items[i].id=', items[i].id);
            if (items[i].id === id) return items[i];
        }
        //console.log('[][][][][');
        return [];
    }

    updateTask(task: Task) {
        console.log('updateTask');
        console.log('task.id=', task.id);

        const items: Task[] = this.readAllTasks();
        console.log('items=', items);

        const result = items.find(function (item: Task) {
            if (item.id === task.id) {
                console.log('update yes');
                //let obj:any;

                for (const k in task) {
                    // const keyTyped = k as keyof typeof item;
                    if (k in item) {
                        console.log('key yes')
                        console.log('key=', k);
                        console.log('task[keyTyped]=', task[k])
                        console.log('item[keyTyped]=', item[k])
                        item[k] = task[k]
                    }
                }                
                return true;
            }
            return false;
        })
        
        console.log('result=', result);
        console.log('items updates=', items);
        localStorage.setItem(key, JSON.stringify(items));
        return items;        
    }

    deleteTask(id: number) {
        console.log('deleteTask');
        //console.log('id=', id);
        const values = localStorage.getItem(key);
        //console.log('values=', values);
        if (values === null) return [];
        const items: Task[] = JSON.parse(values);

        for (let i = 0; i < items.length; i++) {
          //  console.log('items[i]=', items[i]);
           // console.log('items[i].id=', items[i].id);
            if (items[i].id === id) {
                // delete items[i];
                items.splice(i, 1);
             //   console.log('items=', items);                
            }
        }        
        localStorage.setItem(key, JSON.stringify(items));
        return items
        //console.log('[][][][][');        
    }

    sortTask(field: string | number) {
        console.log('sortTask');
        console.log('field=', field);

        const values = localStorage.getItem(key);
        console.log('values=', values);
        if (values === null) return [];

        const items: Task[] = JSON.parse(values);
        console.log('items=', items);

        if (field === 'date') {
            items.sort(function (a: Task, b: Task) {
                console.log('typeof a.date=', typeof a.date)
                console.log('a.date', a.date)
                console.log('res=', new Date(a.date).getTime() - new Date(b.date).getTime())
                return (new Date(a.date).getTime() - new Date(b.date).getTime());
            });

        }

        else {
            items.sort((prev, next) => {
                console.log('prev=', prev);
                console.log('next=', next);
                console.log('prev && next=', prev && next);
                if ((prev && next) !== null) {
                    console.log('ne pusto');
                    if (prev[field] < next[field]) return -1;
                    if (prev[field] < next[field]) return 1;
                }
                return 1;
            });
        }

        console.log('items=', items);

        localStorage.setItem(key, JSON.stringify(items));
        return items;
    }
}


// let items: Task[] = [];
// items.push(task);

// localStorage.setItem(key, JSON.stringify(items));
//localStorage.removeItem(key);


// const calen = new Calendar(task);
console.log('*********************************');
//calen.readAllTasks();
//calen.createTask(task);
//calen.readTask(5);
//calen.updateTask(taskNew);
//calen.deleteTask(5);
// calen.sortTask('date');
