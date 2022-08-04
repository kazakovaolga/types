import { Calendar, Task } from "./calendar";

describe("Inspect Calendar methods", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const task: Task = {
        id: 1,
        category: 'work',
        text: 'test',
        date: new Date('02/28/2019')
    };
    const calendar: Calendar = new Calendar(task);

    it("Calendar is a class", () => {
        expect(new Calendar(task)).toBeInstanceOf(Calendar);
    });

    it("empty task list", () => {
        calendar.readAllTasks();
        const items = calendar.readAllTasks();
        expect(items).toEqual([]);
    });

    it("create new task and same task", () => {
        let items = calendar.createTask(task);           
        items[0].date = new Date(items[0].date);
        expect(items[0]).toEqual(task);
        //same task
        items = calendar.createTask(task);         
        items[0].date = new Date(items[0].date);
        expect(items[0]).toEqual(task);
    });


    it("there is one task in the list", () => {
        calendar.createTask(task);

        const items = calendar.readAllTasks();
        const size = items.length;
        expect(size).toEqual(1);

        items[size - 1].date = new Date(items[size - 1].date);
        expect(items[size - 1]).toEqual(task);
    });

    it("request a non-existent task id=2", () => {
        calendar.createTask(task);

        const item = calendar.readTask(2);
        const size = item.length;
        expect(size).toEqual(0);
        expect(item).toEqual([]);
    });

    it("update task", () => {
        calendar.createTask(task);

        const taskNew = {
            id: 1,
            category: 'game',
            text: 'test',
            date: new Date('02/28/2019')
        };

        const items = calendar.updateTask(taskNew);        
        items[0].date = new Date(items[0].date);
        expect(items[0]).toEqual(taskNew);
    });

    it("update a non-existent task", () => {
        calendar.createTask(task);

        const taskNew = {
            id: 5,
            category: 'work',
            text: 'test',
            date: new Date('02/28/2019')
        };

        const items = calendar.updateTask(taskNew);
        let itemUpdate: Task | [] = [];

        items.forEach(function (item) {
            if (item === taskNew) { itemUpdate = item };
        }
        );

        expect(itemUpdate).toEqual([]);
    });

    it("delete task id=2", () => {
        calendar.createTask(task);

        const taskNew = {
            id: 2,
            category: 'work',
            text: 'test',
            date: new Date('02/28/2019')
        };
        calendar.createTask(taskNew);

        const items = calendar.deleteTask(taskNew.id);
        let itemDelete: Task | [] = [];

        items.forEach(function (item) {
            if (item === taskNew) { itemDelete = item };
        }
        );

        expect(itemDelete).toEqual([]);
    });

    it("sort tasks for id", () => {

        const tasks = [{
            id: 4,
            category: 'work',
            text: 'type script coding',
            date: new Date('07/31/2022')
        },
        {
            id: 2,
            category: 'game',
            text: 'monopoly',
            date: new Date('07/28/2022')
        },
        {
            id: 3,
            category: 'rest',
            text: 'holidays',
            date: new Date('08/07/2022')
        },
        {
            id: 1,
            category: 'sport',
            text: 'yoga',
            date: new Date('08/02/2022')
        }
        ];

        tasks.forEach(function (task) {
            calendar.createTask(task);
        });

        const items = calendar.sortTask("id");

        items.forEach(function (item) {
            item.date = new Date(item.date);
        });

        expect(items).toEqual([{
            id: 1,
            category: 'sport',
            text: 'yoga',
            date: new Date('08/02/2022')
        },
        {
            id: 2,
            category: 'game',
            text: 'monopoly',
            date: new Date('07/28/2022')
        },
        {
            id: 3,
            category: 'rest',
            text: 'holidays',
            date: new Date('08/07/2022')
        },
        {
            id: 4,
            category: 'work',
            text: 'type script coding',
            date: new Date('07/31/2022')
        }
        ]);
    });

    it("sort tasks for date", () => {

        const tasks = [{
            id: 4,
            category: 'work',
            text: 'type script coding',
            date: new Date('07/31/2022')
        },
        {
            id: 2,
            category: 'game',
            text: 'monopoly',
            date: new Date('07/28/2022')
        },
        {
            id: 3,
            category: 'rest',
            text: 'holidays',
            date: new Date('08/07/2022')
        },
        {
            id: 1,
            category: 'sport',
            text: 'yoga',
            date: new Date('08/02/2022')
        }
        ];

        tasks.forEach(function (task) {
            calendar.createTask(task);
        });

        const items = calendar.sortTask("date");

        items.forEach(function (item) {
            item.date = new Date(item.date);
        });

        expect(items).toEqual([
            {
                id: 2,
                category: 'game',
                text: 'monopoly',
                date: new Date('07/28/2022')
            },
            {
                id: 4,
                category: 'work',
                text: 'type script coding',
                date: new Date('07/31/2022')
            },
            {
                id: 1,
                category: 'sport',
                text: 'yoga',
                date: new Date('08/02/2022')
            },

            {
                id: 3,
                category: 'rest',
                text: 'holidays',
                date: new Date('08/07/2022')
            }
        ]);
    });
});
