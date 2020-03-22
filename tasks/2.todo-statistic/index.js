const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const [com, args] = command.split(' ');

    switch (com) {
        case 'exit':
            process.exit(0);
            break;
        case 'files':
            console.log(files);
            break;
        case 'show':
            printTodos(getTodoComments());
            break;
        case 'important':
            printTodos(getImportantTodos(getTodoComments()));
            break;
        case 'user':
            printTodos(getTodosByUsername(args.toLowerCase(), getTodoComments()));
            break;
        case 'sort':
            printTodos(sortTodos(args, getTodoComments()))
            break;
        case 'date':
            printTodos(sortTodos(args, getTodoComments()))
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function splitFileToStrings(allFiles) {
    let allStrings = [];
    for (const file of allFiles) {
        allStrings = allStrings.concat(file.split('\r\n'));
    }
    return allStrings;
}

function getTodoComments() {
    let result = [];
    let allStrings = splitFileToStrings(files);
    for(let str of allStrings) {
        let arr = str.split('\/\/ TODO ');
        if (arr.length > 1) {
            result = result.concat(arr[1]);
        }
    }
    return getTodosObjectsFromArray(result);
}

function getTodosObjectsFromArray(todos){
    let todosObj = [];
    for (todo of todos) {
        let exclamantionCount = todo.split('!').length - 1;
        let newObj = { importance: exclamantionCount };

        let todoElements = todo.split(';');
        if (todoElements.length === 1){
            newObj.user = '';
            newObj.date = '';
            newObj.comment = todoElements[0];
        }
        else {
            newObj.user = todoElements[0];
            newObj.date = todoElements[1].trim();
            newObj.comment = todoElements[2].trim();
        }
        todosObj = todosObj.concat(newObj);
    }
    return todosObj;
}

function getImportantTodos(todos) {
    return todos.filter(x => x.importance > 0);
}

function getTodosByUsername(username, todos){
    return todos.filter(x => x.user.toLowerCase() === username);
}

function sortTodos(criteria, todos) {  
    switch (criteria) {
        case 'importance':
            return sortImportance(todos);
        case 'user':
            return sortUsers(todos);
        case 'date':
            return sortDates(todos);    
    }
}

function sortImportance(todos){
    todos.sort(function (a, b) {
        if (a.importance < b.importance) {
          return 1;
        }
        if (a.importance > b.importance) {
          return -1;
        }        
        return 0;
      });
    return todos;
}

function sortUsers(todos){
    todos.sort(function (a, b) {       
        if (a.user === '') {
            return 1;
        }
        if (b.user === '') {
            return -1;
        }
        if (a.user.toLowerCase() > b.user.toLowerCase()) {
          return 1;
        }
        if (a.user.toLowerCase() < b.user.toLowerCase()) {
          return -1;
        }        
        return 0;
      });
    return todos;
}

function sortDates(todos){
    todos.sort(function (a, b) {       
        if (a.date < b.date) {
          return 1;
        }
        if (a.date > b.date) {
          return -1;
        }        
        return 0;
      });
    return todos;
}

function printTodos(todos) {
    let maxLenghtImportance = 1;
    let maxLenghtUser = 0;
    let maxLenghtDate = 0;
    let maxLenghtComment = 0;
    for (let todo of todos) {
        if(todo.user.length > maxLenghtUser) {
            maxLenghtUser = todo.user.length <= 10 ? todo.user.length : 10;
        }
        if(todo.date.length > maxLenghtDate) {
            maxLenghtDate = todo.user.date <= 10 ? todo.date.length : 10;
        }
        if(todo.comment.length > maxLenghtComment) {
            maxLenghtComment = todo.comment.length <= 50 ? todo.comment.length : 50;
        }
    }
    
    let sumLenght = maxLenghtImportance + maxLenghtDate + maxLenghtUser + maxLenghtComment + 3*1 + 7*2; // последнее символы | и пробелы
    printRow({
        importance: 1,
        user: 'user',
        date: 'date',
        comment: 'comment'
    }, maxLenghtUser , maxLenghtDate, maxLenghtComment)
    console.log('-'.repeat(sumLenght))
    for (let todo of todos) {
        printRow(todo, maxLenghtUser , maxLenghtDate, maxLenghtComment)
    }
    console.log('-'.repeat(sumLenght))
}

function printRow(row, maxLenghtUser, maxLenghtDate, maxLenghtComment) {
    let str = '  ' + (row.importance > 0 ? '!' : ' ').padEnd(1) + '  |  ';
        str += (row.user.lenght <= maxLenghtUser ? row.user : row.user.slice(0, maxLenghtUser)).padEnd(maxLenghtUser);
        str += '  |  '+ row.date.padEnd(maxLenghtDate) + '  |  ';
        str += (row.comment.lenght <= maxLenghtComment ? row.comment : row.comment.slice(0, maxLenghtComment)).padEnd(maxLenghtComment);
        console.log(str);
}

// TODO you can do it!
