let data = [];

function inputFile(event) {
    let file = new FileReader();
    file.onload = Load;
    file.readAsText(event.target.files[0]);
}

function Load(event) {
    data = JSON.parse(event.target.result);
    let jsonData = data;
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    for (let i = 0; i < jsonData.length; i++) {

        let obj = {};
        obj.Task = jsonData[i].Task;
        obj.delay = jsonData[i].delay;
        obj.status = jsonData[i].status;
        obj.id = jsonData[i].id;

        let item = document.createElement('div');
        item.className = "thisTask";
        item.id = obj.id;

        let txt = document.createElement("span");
        txt.innerText = obj.Task;
        txt.className = "task";
        item.appendChild(txt);

        let delayText = document.createElement("span");
        delayText.innerText = "(" + obj.delay + ")";
        delayText.className = "delayText";
        item.appendChild(delayText);

        let statusBtn = document.createElement("button");
        statusBtn.className = "btn";
        let image = document.createElement('img');
        image.className="buttonImage";
        if (obj.status === "in process")
        {
            image.src = "/images/statusbutton.png";
        }
        else{
            image.src = "/images/donebutton.png";
        }
        statusBtn.appendChild(image);
        statusBtn.onclick = statusTask;
        item.appendChild(statusBtn);

        let editBtn = document.createElement("button");
        editBtn.className = "btn";
        let editImg = document.createElement("img");
        editImg.src = "/images/edit.png";
        editBtn.appendChild(editImg);
        editBtn.onclick = editTask;
        item.appendChild(editBtn);

        let delBtn = document.createElement("button");
        delBtn.className = "btn";
        let delImg = document.createElement("img");
        delImg.src = "/images/deletebutton.png";
        delBtn.appendChild(delImg);
        delBtn.onclick = deleteTask;
        item.appendChild(delBtn);

        taskList.appendChild(item);
     }
}

function addTask() {
    const text = prompt("Введите задачу");
    const delay = prompt("Введите срок выполнения")
    if (text !== null)
    {
        let taskList = document.getElementById("taskList");
        const item = document.createElement("div");
        item.className = "thisTask";
        let obj = {};
        obj.Task = text;
        obj.delay = delay;
        obj.status = "in process";

        let childs = taskList.children;
        if (taskList.children.length > 0){
            obj.id = parseInt(taskList.children[childs.length-1].id)+1;
        }
        else{
            obj.id = 0;
        }

        item.id = obj.id;
        data.push(obj);

        let txt = document.createElement("span");
        txt.innerText = text;
        txt.className = "task";
        item.appendChild(txt)

        let delayText = document.createElement("span");
        delayText.innerText = "(" + delay + ")";
        delayText.className = "delayText";
        item.appendChild(delayText);

        let statusBtn = document.createElement("button");
        statusBtn.className = "btn";

        let image = document.createElement("img");
        image.className="buttonImage";
        image.src="/images/statusbutton.png";
        statusBtn.className = "btn";
        statusBtn.onclick = statusTask;
        statusBtn.appendChild(image);
        item.appendChild(statusBtn);

        let editBtn = document.createElement("button");
        editBtn.className = "btn";
        let editImg = document.createElement("img");
        editImg.src = "/images/edit.png";
        editBtn.appendChild(editImg);
        editBtn.onclick = editTask;
        item.appendChild(editBtn);

        let delBtn = document.createElement("button");
        delBtn.className = "btn";
        let delImg = document.createElement("img");
        delImg.src = "/images/deletebutton.png";
        delBtn.appendChild(delImg);
        delBtn.onclick = deleteTask;
        item.appendChild(delBtn);

        taskList.appendChild(item);
    }
}

function deleteTask(event){

    for(let obj of data){
        if (obj.id.toString() === event.currentTarget.parentElement.id)
        {
            data.splice(data.indexOf(obj), 1);
            break;
        }
    }
    event.currentTarget.parentElement.remove();
}

function statusTask(event){
    for (let obj of data){
        if (obj.id.toString() === event.currentTarget.parentElement.id)
        {
            if (obj.status === "in process")
            {
                for (const child of event.currentTarget.children) {
                    if (child.tagName === "IMG") {
                        child.src = "/images/donebutton.png";
                    }
                }
                obj.status = "finished";
            }
            else{
                for (const child of event.currentTarget.children) {
                    if (child.tagName === "IMG") {
                        child.src = "/images/statusbutton.png";
                    }
                }
                obj.status = "in process";
            }
            break;
        }
    }
}

function editTask(event){
    const text = prompt("Введите новый текст задачи");
    const delay = prompt("Введите новый срок выполнения")
    if (text !== null)
    {
        for (let obj of data){
            if (obj.id.toString() === event.currentTarget.parentElement.id)
            {
                obj.Task = text;
                obj.delay = delay;
                for(const child of event.currentTarget.parentElement.children) {
                    if (child.className === "task") {
                        child.innerHTML = text;
                    }
                    if (child.className === "delayText")
                    {
                        child.innerHTML = "(" + delay + ")";
                    }
                }
                break;
            }
        }
    }
}

function clearTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    data = [];
}

function preWriteFile(){
    writeFile(data, "ToDoList");
}

const writeFile = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

document.getElementById("loadJson").addEventListener("change", inputFile);