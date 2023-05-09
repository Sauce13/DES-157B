// JS here
const newBtn = document.getElementById("newbtn");
const editBtns = document.querySelectorAll(".fa-edit");
const addFreindsForm = document.getElementById("add-friend");
const editFreindForm = document.getElementById("edit-friend");
const friendList = document.querySelector("main ol")

newBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    addFreindsForm.className = "add-friend-onscreen";
})

addFreindsForm.addEventListener("submit",event=>{
    event.preventDefault();
    addFreindsForm.className = "add-friend-offscreen";
})

for(let i = 0; i<editBtns.length; i++){
    editBtns[i].addEventListener("click",event=>{
        event.preventDefault();
        editFreindForm.className = "edit-friend-onscreen"
    })
}

editFreindForm.addEventListener("submit",event=>{
    event.preventDefault();
    editFreindForm.className = "edit-friend-offscreen"
})

const displayFriends = async ()=>{
    const friends = Parse.Object.extend("Friends");
    const query = new Parse.Query(friends);

    try{
    const results = await query.ascending("lname").find();
    
    results.forEach(eachFriend=>{
        const id = eachFriend.id;
        const lname = eachFriend.get("lname");
        const fname = eachFriend.get("fname");
        const email = eachFriend.get("email");
        const facebook = eachFriend.get('facebook');
        const twitter = eachFriend.get("twitter");
        const instagram = eachFriend.get("instagram");
        const linkedin = eachFriend.get("linkedin");


        const theListItem = document.createElement("li");
        theListItem.setAttribute("id",`r-${id}`);
        theListItem.innerHTML = `
        <div class="name">${fname} ${lname}
        </div>
        <div class="email">
        <i class="fas fa-envelope-square"></i> ${email}</div>
        <div class="social>
        <a href="${facebook}"><i class="fab fa-facebook-square"></i></a>
        <a href="${twitter}"><i class="fab fa-facebook-square"></i></a>
        <a href="${instagram}"><i class="fab fa-facebook-square"></i></a>
        <a href="${linkedin}"><i class="fab fa-facebook-square"></i></a>
        </div>
        <i class="fas fa-edit" id="e-${id}></i>
        <i class="fas fa-times-circle id="d-${id}"></i>`;
        friendList.append(theListItem);
    })}
    catch(error){
        console.error("Error while fetching Friends",error);
    };


}


displayFriends();
