let dom_list = document.getElementById("items");
let list_inpt = document.getElementById("inpt");
let no_items_div = document.getElementById("noitems");
let pattern = /([^\s]*)\s+(\d+(\.\d+)?)$/;
let items_list = {};
let inpt_label = document.querySelector("label");
let error_value = false;
let current_item;
const label_text = "Enter name & value seperated by space :";

function createItem(name, value) {
	current_item = document.createElement("div");
	let text = document.createElement("h4");
	text.innerText = `${name} : ${value}`;
	current_item.appendChild(text);
	current_item.classList.add("item");
}

function valuateInput(value) {
	value = value.trim();
	let matchObject = value.match(pattern);
	return matchObject;
}

function showError(message) {
	if(!error_value){
		inpt_label.innerText = message;
		list_inpt.classList.add("error");
	}
	list_inpt.classList.add("error-animation");
	list_inpt.addEventListener("animationend", ()=>{
		list_inpt.classList.remove("error-animation");
	});
	error_value = true;
}
function assistTransition(){
	dom_list.prepend(current_item);
	dom_list.classList.remove("make-space");
	current_item.classList.add("fade-in-animation");
	current_item.addEventListener("animationend", ()=>{
		current_item.style.opacity = 1;
	});
	dom_list.removeEventListener("animationend", assistTransition);
}
function addItem(new_name,new_val){
	if(new_name in items_list){
		showError("This name already exists  !!!");
		return;
	}
	if(Object.keys(items_list).length === 0){
		no_items_div.style.display = "none";
	}
	createItem(new_name, new_val);
	dom_list.classList.add("make-space");
	list_inpt.value = "";
	dom_list.addEventListener("animationend", assistTransition);
	

	items_list[new_name] = {
		name: new_name,
		value: new_val,
		dom_obj: current_item
	}
	console.log(items_list);
}

list_inpt.addEventListener("keyup", (e) => {
	if(error_value){
		console.log("hi");
		inpt_label.innerText = label_text;
		list_inpt.classList.remove("error");
		error_value = false;
	}

	if(!(e.key == "Enter")){
		return;
	}

	let match_obj = valuateInput(list_inpt.value);
	if (!match_obj) {
		console.log("bi");
		showError("Invalid input  !!!");
		return;
	}

	addItem(match_obj[1], Number(match_obj[2]));
});