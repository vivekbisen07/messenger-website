const socket = io();
var username;
var chats=document.querySelector("#chat-window");
var user_list = document.querySelector(".user-list");
var user_count = document.querySelector(".users-count");
var user_msg = document.querySelector("#user-msg");
var msg_send = document.querySelector("#user-send")

do{
    username=prompt("Enter your name");
}while(!username);

socket.emit("new-user-joined",username);

socket.on('user-connected',(socket_name)=>{
    userjoinleft(socket_name,'joined');
});

function userjoinleft(name,status){
    let div=document.createElement("div");
    div.classList.add('user-join');
    let content = `<p><b>${name}<b> ${status} the chat </p>`;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}
socket.on('user-disconnected',(user)=>{
    userjoinleft(user,'left');
}); 

socket.on('user-list',(users)=>{
    user_list.innerHTML="";
    user_arr=Object.values(users);
    for(i=0;i<user_arr.length;i++){
        let p = document.createElement("p")
        p.innerText = user_arr[i];
        user_list.appendChild(p)
    }
    user_count.innerHTML = user_arr.length; 
});

msg_send.addEventListener("click",()=>{
    let data ={
        user:username,
        msg : user_msg.value
    }
    if(user_msg.value!=''){
        appendMessage(data,'outgoing-message');
        socket.emit('message',data);
        user_msg.value='';
    }
});

function appendMessage(data ,status){
    let div = document.createElement('div');
    div.classList.add("msg",status);
    let content =`<h6>${data.user}</h6>
    <p>${data.msg}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div)
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming-message');
});