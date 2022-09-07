import { remoteStorageCalendar, Task } from "./calendar";

let task: Task = {
    id: 1,
    category: 'work',
    text: 'test',
    date: new Date('02/28/2019')
};

describe("Inspect Calendar methods", () => {
    const unmockedFetch = global.fetch;
    beforeEach(() => {
        function mockResponse() {
            return new Promise((resolve) => {
                resolve({
                    ok: true,
                    status: 200,
                    json: () => {
                        return [task];
                    },
                });
            });
        };
        global.fetch = jest.fn().mockImplementation(mockResponse);
    });

    afterEach(() => {
        global.fetch = unmockedFetch;
    });



    const namespace = 'calendar1';
    const calendar: remoteStorageCalendar = new remoteStorageCalendar(task as Task, namespace);

    it("Calendar is a class", () => {
        expect(new remoteStorageCalendar(task as Task, namespace)).toBeInstanceOf(remoteStorageCalendar);
    });

    it("mock empty task list", async () => {
        const items = await calendar.readAllTasks(namespace);
        expect(items).toEqual([task]);
    });

    it("create new task and same task", async () => {
        task = {
            id: 2,
            category: 'home',
            text: 'test',
            date: new Date('02/28/2019')
        };

        const items = await calendar.createTask(task, namespace);
        expect(items[0]).toEqual(task);
    });


    it("there is one task in the list", async () => {
        task = {
            id: 3,
            category: 'hobby',
            text: 'test',
            date: new Date('02/18/2019')
        };

        calendar.createTask(task, namespace);

        const items = await calendar.readAllTasks(namespace);
        const size = items.length;
        expect(size).toEqual(1);

        items[size - 1].date = new Date(items[size - 1].date);
        expect(items[size - 1]).toEqual(task);
    });

    it("request a non-existent task id=3", async () => {
        task = {
            id: 3,
            category: 'hobby',
            text: 'test',
            date: new Date('02/18/2019')
        };

        calendar.createTask(task, namespace);

        const item = await calendar.readTask(2, namespace);
        const size = item.length;
        expect(size).toEqual(0);
        expect(item).toEqual([]);
    });

    it("update task", async () => {
        console.log('UPDATE TASK');
        task = {
            id: 3,
            category: 'hobby',
            text: 'test',
            date: new Date('02/18/2019')
        };

        await calendar.createTask(task, namespace);

        const taskNew = {
            id: 3,
            category: 'game',
            text: 'test',
            date: new Date('02/28/2019')
        };

        const items = await calendar.updateTask(taskNew, namespace);
        items[0].date = new Date(items[0].date);
        expect(items[0]).toEqual(taskNew);
    });

    it("update a non-existent task", async () => {
        task = {
            id: 3,
            category: 'hobby',
            text: 'test',
            date: new Date('02/18/2019')
        };

        await calendar.createTask(task, namespace);

        const taskNew = {
            id: 5,
            category: 'work',
            text: 'test',
            date: new Date('02/28/2019')
        };

        const items = await calendar.updateTask(taskNew, namespace);
        let itemUpdate: Task | [] = [];

        items.forEach(function (item) {
            if (item === taskNew) { itemUpdate = item };
        }
        );

        expect(itemUpdate).toEqual([]);
    });

    it("delete task id=2", async () => {
        task = {
            id: 2,
            category: 'work',
            text: 'test',
            date: new Date('02/28/2019')
        };
        await calendar.createTask(task, namespace);

        const items = await calendar.deleteTask(task.id, namespace);
        let itemDelete: Task | [] = [];

        items.forEach(function (item) {
            if (item === task) { itemDelete = item };
        }
        );

        expect(itemDelete).toEqual([]);
    });

});
