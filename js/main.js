// =====================
// setting variables
// =====================
let input = document.querySelector(".add-task input")
let add_task = document.querySelector(".plus")
let task_content = document.querySelector(".task-content")
let task_count = document.querySelector(".task-count span")
let task_completed = document.querySelector(".task-completed span")
let icon = document.querySelector(".task-content i")
let message = document.querySelector(".message")

let completeAllBtn = document.querySelector(".complete-all");
let deleteAllBtn = document.querySelector(".delete-all");

// =====================
// focus + load
// =====================
window.onload = function(){
    input.focus();
    loadFromLocalStorage();
}

// =====================
// add task
// =====================
add_task.onclick = function(){

    if(input.value === ''){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter A Task!"
        });
        return;
    }

    if(message && document.body.contains(message)){
        message.remove();
    }

    if(icon){
        icon.remove();
    }

    // check duplicate
    let task_text = document.querySelectorAll(".task_text")
    let exist = false;

    task_text.forEach((task)=>{
        if(task.textContent.trim().toLowerCase() === input.value.trim().toLowerCase()){
            exist = true;
        }
    });

    if(exist){
        Swal.fire({
            icon: "warning",
            title: "Task Already Exists",
            text: "Please Write A Different Task."
        });
        input.value = "";
        return;
    }

    createTask(input.value, false);

    input.value = "";
    calcTasks();
    saveToLocalStorage();

  Swal.fire({
  title: "Your Task Added Successful!",
  icon: "success",
  draggable: true
});
}

// =====================
// create task function
// =====================
function createTask(text, completed){

    let emptyMsg = document.querySelector(".empty_msg");
    if(emptyMsg){
        emptyMsg.remove();
    }

    let mainspan = document.createElement("span");
    mainspan.classList.add(
        "flex","bg-white","border-2","py-1","px-3","rounded-[6px]",
        "items-center","justify-between","w-full","border-[#6A7282]","mb-4"
    );

    let text_span = document.createElement("span");
    text_span.textContent = text;
    text_span.classList.add("text-[#0EA5A4]","task_text","cursor-pointer");

    if(completed){
        text_span.classList.add("line-through");
    }

    let delete_button = document.createElement("button");
    delete_button.textContent = "Delete";
    delete_button.classList.add(
        "text-white","rounded-[6px]","p-1",
        "bg-[#e7000b]","font-bold",
        "hover:scale-105","duration-300","cursor-pointer"
    );

    mainspan.appendChild(text_span);
    mainspan.appendChild(delete_button);
    task_content.appendChild(mainspan);
}

// =====================
// click events
// =====================
document.addEventListener("click",(e)=>{

    // delete task
    if(e.target.textContent === "Delete"){

        e.target.parentElement.remove();

        if(task_content.childElementCount === 0){
            createNoTasks();
        }

        calcTasks();
        saveToLocalStorage();

       Swal.fire({
  title: "Your Task deleted Successful!",
  icon: "success",
  draggable: true
});
    }

    // toggle completed
    if(e.target.classList.contains("task_text")){
        e.target.classList.toggle("line-through");
        calcTasks();
        saveToLocalStorage();
    }

});

// =====================
// complete all
// =====================
completeAllBtn.addEventListener("click", ()=>{

    Swal.fire({
        title: "Complete all tasks?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
    }).then((result)=>{

        if(result.isConfirmed){

            let tasks = document.querySelectorAll(".task_text");
            tasks.forEach(task=>{
                task.classList.add("line-through");
            });

            calcTasks();
            saveToLocalStorage();

            Swal.fire({
                icon: "success",
                title: "All Tasks Completed",
                timer: 1700,
                showConfirmButton: false
            });
        }
    });
});

// =====================
// delete all
// =====================
deleteAllBtn.addEventListener("click", ()=>{

    Swal.fire({
        title: "Delete all tasks?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e7000b",
        confirmButtonText: "Yes, delete all"
    }).then((result)=>{

        if(result.isConfirmed){

            task_content.innerHTML = "";
            createNoTasks();

            calcTasks();
            saveToLocalStorage();

            Swal.fire({
                icon: "success",
                title: "All Tasks Deleted",
                timer: 1700,
                showConfirmButton: false
            });
        }
    });
});

// =====================
// empty message
// =====================
function createNoTasks(){

    let task_message = document.createElement("span")
    task_message.textContent = "No Tasks To Show";
    task_message.classList.add("text-[#6B7280]","font-bold","empty_msg")
    task_content.appendChild(task_message)

}

// =====================
// calculate tasks
// =====================
function calcTasks(){

    let tasks = document.querySelectorAll(".task_text");
    let completed = document.querySelectorAll(".line-through");

    task_count.textContent = tasks.length;
    task_completed.textContent = completed.length;
}

// =====================
// local storage save
// =====================
function saveToLocalStorage(){

    let tasks = [];

    document.querySelectorAll(".task_text").forEach(task=>{
        tasks.push({
            text: task.textContent,
            completed: task.classList.contains("line-through")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// =====================
// local storage load
// =====================
function loadFromLocalStorage(){

    let data = localStorage.getItem("tasks");

    task_content.innerHTML = "";

    if(data){

        let tasks = JSON.parse(data);

        tasks.forEach(task=>{
            createTask(task.text, task.completed);
        });

    }

    if(task_content.childElementCount === 0){
        createNoTasks();
    }

    calcTasks();
}