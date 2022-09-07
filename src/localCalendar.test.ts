import { localStorageCalendar, Task } from "./calendar";

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

    const namespace = 'calendar1';
    const calendar: localStorageCalendar = new localStorageCalendar(task,namespace);

    it("Calendar is a class", () => {
        expect(new localStorageCalendar(task,namespace)).toBeInstanceOf(localStorageCalendar);
    });

    it("empty task list", async() => {        
        const items = await calendar.readAllTasks(namespace);
        expect(items).toEqual([]);
    });

    it("create new task and same task", async() => {
        const items = await calendar.createTask(task,namespace);           
        items[0].date = new Date(items[0].date);
        expect(items[0]).toEqual(task);        
    });


    it("there is one task in the list", async() => {
        await calendar.createTask(task,namespace);

        const items = await calendar.readAllTasks(namespace);
        const size = items.length;
        expect(size).toEqual(1);

        items[size - 1].date = new Date(items[size - 1].date);
        expect(items[size - 1]).toEqual(task);
    });

    it("request a non-existent task id=2", async() => {
        await calendar.createTask(task,namespace);

        const item = await calendar.readTask(2,namespace);
        const size = item.length;
        expect(size).toEqual(0);
        expect(item).toEqual([]);
    });

    it("update task", async() => {
        await calendar.createTask(task,namespace);

        const taskNew = {
            id: 1,
            category: 'game',
            text: 'test',
            date: new Date('02/28/2019')
        };

        const items = await calendar.updateTask(taskNew,namespace);        
        items[0].date = new Date(items[0].date);
        expect(items[0]).toEqual(taskNew);
    });

    it("update a non-existent task", async() => {
        await calendar.createTask(task,namespace);

        const taskNew = {
            id: 5,
            category: 'work',
            text: 'test',
            date: new Date('02/28/2019')
        };

        const items = await calendar.updateTask(taskNew,namespace);
        let itemUpdate: Task | [] = [];

        items.forEach(function (item) {
            if (item === taskNew) { itemUpdate = item };
        }
        );

        expect(itemUpdate).toEqual([]);
    });

    it("delete task id=2", async() => {
        await calendar.createTask(task,namespace);

        const taskNew = {
            id: 2,
            category: 'work',
            text: 'test',
            date: new Date('02/28/2019')
        };
        await calendar.createTask(taskNew,namespace);

        const items = await calendar.deleteTask(taskNew.id,namespace);
        let itemDelete: Task | [] = [];

        items.forEach(function (item) {
            if (item === taskNew) { itemDelete = item };
        }
        );

        expect(itemDelete).toEqual([]);
    });
   
});