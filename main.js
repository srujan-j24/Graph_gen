let dom_list = document.getElementById("items");
let list_inpt = document.getElementById("inpt");
let no_items_div = document.getElementById("noitems");
let pattern = /([^\s]*)\s+(\d+(\.\d+)?)$/;
let items_list = {};
let inpt_label = document.querySelector("label");
let error_value = false;	//signifies if the input is colored red or not
let current_item;
let max_val = -1;
let garph_cont = document.getElementById("graph-container");
const label_text = "Enter name & value seperated by space :";


function createItem(name, value) {
	current_item = document.createElement("div");
	let text = document.createElement("h4");
	let del_btn = document.createElement("button");
	let edi_btn = document.createElement("button");
	del_btn.classList.add("btn");
	edi_btn.classList.add("btn");
	del_btn.classList.add("del-btn");
	edi_btn.classList.add("edit-btn");
	text.innerText = `${name} : ${value}`;
	current_item.appendChild(text);
	current_item.prepend(del_btn);
	current_item.prepend(edi_btn);
	current_item.classList.add("item");
}


function random(){
	return Math.floor(Math.random()*255);
}
function genRandomColor(){
	return `rgb(${random()}, ${random()}, ${random()})`;
}

function createBar(height){
	let new_bar = document.createElement("div");
	new_bar.style.height = `${height}%`;
	new_bar.classList.add("bar-graphs");
	console.l
	new_bar.style.backgroundColor = genRandomColor();
	return new_bar;
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


function findMax(){
	temp = -1;
	for(item in items_list){
		if(item.value > temp)
			temp = item.value;
	}
	return temp;
}

function recalcuateItems(cur_val){
	if(cur_val <= max_val){
		return (cur_val/max_val)*100;	//returning the calculate percentage
	}else{
		max_val = cur_val;
		for(item in items_list){
			function col (item){
				let new_height = ((items_list[item].value/max_val)*100).toFixed(4).toString();
				items_list[item].dom_bar.animate(
					[
						{height: `${items_list[item].height}%`},
						{height: `${new_height}%`}
					],
					{
						duration: 500,
						easing: "ease-in-out"
					}
				).finished.then(()=>{
					console.log("helooooooooooooooooooooo");
					console.log(items_list[item]);
					items_list[item].dom_bar.style.height = `${new_height}%`;
					items_list[item].height = new_height;
				});
			}
			col(item);
		}
		return 100;		//return 100%
	}
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
	let cur_height = recalcuateItems(new_val);
	let cur_bar = createBar(cur_height);
	garph_cont.animate(
		[
			{paddingLeft: "2rem"},
			{paddingLeft: "6.5rem"}
		],
		{
			duration: 500,
			easing: "ease-in-out"
		}
	).finished.then(()=>{
		garph_cont.prepend(cur_bar);
	});
	items_list[new_name] = {
		name: new_name,
		value: new_val,
		dom_item: current_item,
		dom_bar: cur_bar,
		height: cur_height
	}
	console.log(items_list);
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