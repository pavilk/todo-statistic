const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();
const parsedFile = parse();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const parts = command.split(' ');
    const baseCommand = parts[0];

    switch (baseCommand) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(parsedFile);
            break;
        case 'user':
            const userName = parts[1];
            console.log(userTodos(userName))
            break;
        case 'important':
            console.log(findImportant());
            break;
        case 'sort':
            const type = parts[1];
            if (type === 'importance') {
                console.log(sortImportance());
            } else if (type === 'user') {
                sortUser();
            } else {
                sortDate();
            }
            break;

        default:
            console.log('wrong command');
            break;
    }
}

function userTodos(userName) {
    const todos = parse();
    const result = [];
    if (!userName)
        return result;
    for (const todo of todos) {
        const authorPart = todo.split(';')[0];
        if (authorPart.toLowerCase().includes(userName.toLowerCase())) {
            result.push(todo);
        }
    }

    return result;
}

function parse() {
    const todos = [];
    for (const file of files) {
        const lines = file.split(/\r?\n/);
        for (let line of lines) {
            const index = line.indexOf('// TODO');
            if (index !== -1) {
                const todo = line.slice(index).trim();
                todos.push(todo);
            }
        }
    }
    return todos;
}

function findImportant() {
    let result = [];
    for (const line of parsedFile) {
        const index = line.indexOf('!');
        if (index !== -1) {
            result.push(line);
        }
    }
    return result;
}

function sortImportance() {
    const preprocc = [];
    for (const line of parsedFile) {
        const index = line.indexOf('!');
        let countOfSymbols = 0;
        if (index !== -1) {
            for (const symbol of line) {
                if (symbol === '!') {
                    countOfSymbols++;
                }
            }
        }
        preprocc.push( [line, countOfSymbols] );
    }
    preprocc.sort((a, b) => b[1] - a[1]);
    return preprocc.map(item => item[0]);
}

function getUserFromTodo(todo) {
    const parts = todo.split(';'); 
    const firstPart = parts[0];
    const user = firstPart.replace('// TODO', '').trim();
    return user;
}

function sortUser() {
    const usersTodos = {};
    const noUser = [];
    for (const todo of parsedFile) {
        const user = getUserFromTodo(todo);
        if (!user) {
            noUser.push(todo);
            continue;
        }
        if (!usersTodos[user]) {
            usersTodos[user] = [];
        }
        usersTodos[user].push(todo);
    }

    for (const user of Object.keys(usersTodos)) {
        console.log(`\n${user}:`);
        usersTodos[user].forEach(todo => console.log(`  ${todo}`));
    }

    if (noUser.length > 0) {
        console.log('\nNo user:');
        noUser.forEach(todo => console.log(`  ${todo}`));
    }
}

function sortDate() {
    const todosWithDate = [];
    const todosWithoutDate = [];
    for (const todo of parsedFile) {
        const parts = todo.split(';');
        let foundDate = null;
        if (parts.length === 3) {
            const trimmed = parts[1].trim();
            foundDate = trimmed;
        }

        if (foundDate) {
            todosWithDate.push({
                text: todo,
                date: foundDate
            });
        } else {
            todosWithoutDate.push(todo);
        }
    }
    todosWithDate.sort((a, b) => {
        if (a.date > b.date)
            return -1;
        if (a.date < b.date)
            return 1;
        return 0;
    });

    for (const item of todosWithDate) {
        console.log(item.text);
    }
    for (const item of todosWithoutDate) {
        console.log(item);
    }
}
// TODO Do it!