let root = document.documentElement;
let dom_list = document.getElementById("list");
let dom_inpt = document.getElementById("inpt");
let dom_no_item = document.getElementById("no-items");
let dom_inpt_label = document.querySelector("label");
let dom_garph_container = document.getElementById("graph-container");
let dom_space_inpt = document.getElementById("space-inpt");
let dom_width_inpt = document.getElementById("width-inpt");

const pattern = /([^\s]*)\s+(\d+(\.\d+)?)$/;
const pattern2 = /([^\s]*)\s:\s(\d+(\.\d+)?)$/;
const pattern3 = /(\d+(\.\d+)?)$/;
const default_label_text = "Enter name & value seperated by space :";

let list = {};  // Will hold the objects of valid inputs
let error_acitve = false;
let max_val = -1;
let calibration_needed = false;
let is_new_max = false;
let total_inpts = 0;
let bar_width = 32;
let graph_space = 40;
let new_inpt_node, new_bar_node, match_obj, new_bar_wrapper, new_height_percent, new_span_node;

function calibrateBars(i){
    let new_percent = ((list[i].value/max_val)*100).toFixed(4).toString();
    list[i].bar_node.animate(
        [
            {height: `${list[i].height_percent}`},
            {height: `${new_percent}%`}
        ],
        {
            duration: 500,
            easing: "ease-in-out"
        }
    ).finished.then(()=>{
        list[i].bar_node.style.height = `${new_percent}%`;
        list[i].height_percent = `${new_percent}%`;
    })
}

function animateNodeAdditions(){
    dom_list.animate(
        [
            {paddingTop: "0rem"},
            {paddingTop: "3.5rem"}
        ],
        {
            duration: 500,
            easing: "ease-in-out"
        }
    ).finished.then(()=>{
        dom_list.prepend(new_inpt_node);
        return new_inpt_node.animate(
            [
                {opacity: "0"},
                {opacity: "1"}
            ],
            {
                duration: 500,
                easing: "ease-in-out"
            }
        ).finished;
    }).then(()=>{
        new_inpt_node.classList.add("ani-item");
    });
    if(calibration_needed){
        for(i in list){
            calibrateBars(i);
        }
        calibration_needed = false;
    }
    console.log(graph_space);
    console.log(bar_width);
    dom_garph_container.animate(
        [
            {paddingLeft: `${graph_space}px`},
            {paddingLeft: `${graph_space*2 + bar_width}px`}
        ],
        {
            duration: 500,
            easing: "ease-in-out"
        }
    ).finished.then(()=>{
        dom_garph_container.prepend(new_bar_wrapper);
    })

}

function genRandNum(){
    return Math.floor(Math.random()*255);
}

function genRandomColor(){
    return `rgb(${genRandNum()}, ${genRandNum()}, ${genRandNum()})`;
}

function calcHeightPercentage(value){
    if(value <= max_val){
        return `${((value/max_val)*100).toFixed(4)}%`;
    }else{
        max_val = value;
        calibration_needed = true;
        return  "100%";
    }
}

function createBarNode(name, value){
    new_height_percent = calcHeightPercentage(value);
    new_bar_wrapper = document.createElement("div");
    new_bar_node = document.createElement("div");
    new_bar_wrapper.appendChild(new_bar_node);
    new_bar_wrapper.style.height = new_height_percent;
    new_bar_wrapper.classList.add("bar-graph-wrapper");
    new_bar_node.classList.add("bar-graph");
    new_bar_node.style.backgroundColor = genRandomColor();
}



function addEdtAction(node){
    let name = node.parentNode.innerText.trim().match(pattern2)[1];
    list[name].span_node.innerHTML = "";
    let editInpt = document.createElement("input");
    editInpt.value = list[name].value;
    list[name].span_node.appendChild(editInpt);
    editInpt.addEventListener("keypress", (e)=>{
        if(e.key == "Enter"){
            if(editInpt.value.match(pattern3)){
                console.log(name);
                list[name].value = Number(editInpt.value);
                max_val = findMax();
                for(i in list){
                    calibrateBars(i);
                }
                list[name].span_node.innerHTML = list[name].value;

            }
            else{
                editInpt.classList.add("error");
                editInpt.animate(
                    [
                        {transform: "translateX(-2px)"},
                        {transform: "translateX(2px)"},
                        {transform: "translateX(2px)"},
                        {transform: "translateX(-2px)"}
                    ],
                    {
                        duration: 100,
                        iterations: 2
                    }
                ).finished.then(()=>{

                    editInpt.classList.remove("error");
                })
            }
        }
    })
}

function removeBar(node){
    node.animate(
        [
            {opacity: "1" },
            {opacity: "0"}
        ],
        {
            duration: 500,
            easing: "ease-in-out"
        }
    ).finished.then(()=>{
        node.style.opacity = "0";
        node.animate(
            [
                {width:`${bar_width}px`,marginRight: `${graph_space}px`},
                {width: '0px', marginRight: "0px"}
            ],
            {
                duration: 500,
                easing: "ease-in-out"
            }
        ).finished.then(()=>{
            if(node){
                node.remove();
            }
        });
    });
}
function removeInpt(node, name){
    node.animate(
        [
            {transform: "scale(1)"},
            {transform: "scale(1.05)"},
            {transform: "scale(0)", opacity: "0"}
        ],
        {
            duration: 500,
            easing: "ease-in-out"
        }
    ).finished.then(()=>{
        node.classList.remove('ani-item');
        return node.animate(
            [
                {height: "3rem"},
                {height: "0rem"}
            ],
            {
                duration: 500,
                easing: "ease-in-out"
            }
        ).finished;
    }).then(()=>{
        node.remove();
        delete list[name];
        total_inpts -= 1;
        max_val = findMax();
        for(i in list){
            calibrateBars(i);
        }
        console.log(list);
        if(total_inpts == 0){
            dom_no_item.style.display = "flex";
        }
    })
}

function findMax(){
    let new_max = -1;
    for(i in list){
        if(list[i].value > new_max){
            new_max = list[i].value;
        }
    }
    return new_max;
}

function addDelAction(node){
    let name = node.parentNode.innerText.trim().match(pattern2)[1];
    removeBar(list[name].bar_node);
    removeInpt(list[name].inpt_node, name);
        
}

function createInptNode(name, value){
    new_inpt_node = document.createElement("div");
    let text_node = document.createElement("h4");
    new_span_node = document.createElement("span");
    let delBtn_node = document.createElement("button");
    let edtBtn_node = document.createElement("button");
    new_span_node.innerText = `${value}`;
    new_inpt_node.classList.add("list-item");
    delBtn_node.classList.add("btn", "del-btn");
    edtBtn_node.classList.add("btn", "edt-btn");
    text_node.innerText = `${name} : `; 
    text_node.appendChild(new_span_node);
    delBtn_node.addEventListener("click", ()=>{addDelAction(delBtn_node)});
    edtBtn_node.addEventListener("click", ()=>{addEdtAction(edtBtn_node)});
    new_inpt_node.appendChild(text_node);
    new_inpt_node.appendChild(delBtn_node);
    new_inpt_node.appendChild(edtBtn_node);
}

function showError(message){
    dom_inpt_label.innerText = message;
    if(!error_acitve){
        dom_inpt.classList.add("error");
    }
    dom_inpt.animate(
        [
            {transform: "translateX(-2px)"},
			{transform: "translateX(2px)"},
			{transform: "translateX(2px)"},
			{transform: "translateX(-2px)"}
        ],
        {
            duration: 100,
			iterations: 2
        }
    )
    error_acitve = true;
}

function addInput(){
    let new_name = match_obj[1];
    let new_value = Number(match_obj[2]);

    if(new_name in list){
        showError("This name already exists !!!");
        return;
    }

    if(total_inpts === 0){
        dom_no_item.style.display = "none";
    }

    createInptNode(new_name, new_value);
    createBarNode(new_name, new_value);
    dom_inpt.value = "";
    animateNodeAdditions();

    list[new_name] = {
        name: new_name,
        value: new_value,
        height_percent: new_height_percent,
        inpt_node: new_inpt_node,
        bar_node: new_bar_wrapper,
        span_node: new_span_node
    }
    total_inpts += 1;   //incrementing total_inpts
}

function evaluateInput(){
    let value = dom_inpt.value.trim();
    match_obj = value.match(pattern);
    if(match_obj === null){
        showError("Invalid input !!!");
        return false;
    }
    return true;
}

function removeError(){
    dom_inpt_label.innerText = default_label_text;
    dom_inpt.classList.remove("error");
    error_acitve = false;
}

// ------------------------- Main Logic -------------------------
// adding listner to the input
dom_inpt.addEventListener("keyup", (e)=>{
    if(error_acitve){
        removeError();  
    }

    if(e.key != "Enter"){
        return;         //exit if not enter key
    }

    if(!evaluateInput()){
        return;         //exit invalid input
    }

    addInput();
});


dom_space_inpt.addEventListener("input", ()=>{
    root.style.setProperty("--graph-space", `${dom_space_inpt.value}px`);
    graph_space = Number(dom_space_inpt.value);
});

dom_width_inpt.addEventListener("input", ()=>{
    root.style.setProperty("--bar-width", `${dom_width_inpt.value}px`)
    bar_width = Number(dom_width_inpt.value);
})
