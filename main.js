let dom_list = document.getElementById("items");
let list_inpt = document.getElementById("inpt");
let pattern = /([^\s]*)\s+(\d+(\.\d+)?)$/;
let items_list = {};
let inpt_label = document.querySelector("label");
let error_value = false;
const label_text = "Enter name & value seperated by space :";

function createItem(name, value) {
	let newDiv = document.createElement("div");
	let text = document.createElement("h4");
	text.innerText = `${name} : ${value}`;
	newDiv.appendChild(text);
	newDiv.classList.add("item");
	return newDiv;
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
	let new_name = match_obj[1];
	let new_val = Number(match_obj[2]);
	if(new_name in items_list){
		showError("This name already exists  !!!");
		return;
	}
	let newItem = createItem(new_name, new_val);
	dom_list.prepend(newItem);
	list_inpt.value = ""

	
});