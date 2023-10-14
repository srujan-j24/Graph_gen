let list = document.getElementById("items");
let list_inpt = document.getElementById("inpt");
let pattern =  /([^\s]*)\s(\d+(\.\d+)?)$/;
let items_list = {}


list_inpt.addEventListener("keyup", (e)=>{
  if(e.key == "Enter"){
    let inpt_val = list_inpt.value.trim();
    let m_ary= inpt_val.match(pattern);
    if(m_ary){
      let name = m_ary[1];
      let val = m_ary[2];
      if(name in items_list){
        
      }else{

      }
    }else{
      list_inpt.classList.add("error")
      setTimeout(()=>{list_inpt.classList.remove("error")}, 500);
    }
  }
  

})

function addNewItem(name, value){
  let new_item = document.createElement("div");
  new_item.classList.add("item");
  new_item.id = name;
  list.appendChild(new_item);
}




// const input = "word123,42";
// const pattern = /(\w+),(\d+)/;
// const match = input.match(pattern);

// if (match) {
//   const word = match[1];
//   const number = match[2];
//   console.log("Word:", word);
//   console.log("Number:", number);
// } else {
//   console.log("No match found.");
// }