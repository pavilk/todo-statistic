const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const parsedFile = parse();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(parsedFile);
            break;
        case 'important':
            console.log(findImportant());
            break;
        default:
            console.log('wrong command');
            break;
    }
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
        const index = line.indexOf('!')
        if (index !== -1) {
            result.push(line);
        }
    }
    return result;
}
// TODO you can do it!
