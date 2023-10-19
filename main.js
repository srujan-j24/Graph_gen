let dom_list = document.getElementById("items");
let list_inpt = document.getElementById("inpt");
let no_items_div = document.getElementById("noitems");
let pattern = /([^\s]*)\s+(\d+(\.\d+)?)$/;
let items_list = {};
let inpt_label = document.querySelector("label");
let error_value = false;	//signifies if the input is colored red or not
let current_item;
let max_val = -1;
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
	let rec = list_inpt.animate(
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
	console.log(rec);
	error_value = true;
}

function assistTransition(){
	let make_space = dom_list.animate(
		[
			{paddingTop: "0rem"},
			{paddingTop: "3.5rem"}
		],
		{
			duration: 500,
			easing: "ease-in-out"
		}
	);
	make_space.finished.then(()=>{
		dom_list.prepend(current_item);
		return current_item.animate(
			[
				{opacity: "0"},
				{opacity: "1"}
			],
			{
				duration: 500,
				easing: "ease-in-out"
			}
		).finished;
	}).then(()=>{current_item.classList.add("ani-item");});

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
	list_inpt.value = "";
	assistTransition();
	
	items_list[new_name] = {
		name: new_name,
		value: new_val,
		dom_obj: current_item
	}

}

list_inpt.addEventListener("keyup", (e) => {
	if(error_value){
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