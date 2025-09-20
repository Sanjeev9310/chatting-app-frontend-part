import React, { createContext, useEffect, useRef, useState } from 'react'
import "./chat.css"
import axios from "axios"
import { Navigate, useNavigate } from 'react-router'
import GroupCreationModal from './GroupCreationModal.jsx'
import socket from "./socket.js";
// import io from "socket.io-client";

const Chat = () => {
  const navigate=useNavigate();
  const [modalStatus,setModalStatus]=useState(false);
  const [data,setData]=useState([]);
  const [chatData,setChatData]=useState([]);
  const [searchdata,setsearchData]=useState([]);
  const [input,setInput]=useState("");
  const [status,setStatus]=useState(false);

  const [chat,setChat]=useState({});
  const [chatStatus,setChatStatus]=useState(false);
  const [messageStatus,setMessageStatus]=useState(false);
  const [typeMessage,settypeMessage]=useState("");
  const [chatTitleStatus,setChatTitleStatus]=useState(false);

  const [allMessages,setAllMessages]=useState([]);

  const [seenStatus,setSeenStatus]=useState(false);
  // const [latestMsg,setlatestMsg]=useState("");
  // const [sendMessage,setSendMessage]=useState("");
  
  // const socket=io("http://localhost:5000");
  
  const sideBarRef=useRef();
  useEffect(()=>{
     function handleClickOutside(e){
          if(sideBarRef.current && !sideBarRef.current.contains(e.target)){
            setStatus(false);
            setInput("");
          }
        }
          document.addEventListener("mousedown",handleClickOutside);
          return ()=>{
            document.removeEventListener("mousedown",handleClickOutside);
          };
        }
      ,[]);
  // whenever user login it display data of logged in user like username and password
  useEffect(()=>{
       const responseUserDetail=JSON.parse(localStorage.getItem("userinfo"));
       setData(responseUserDetail);

       axios.get("http://localhost:5000/api/v/chat/fetch-chatData",
        {
         headers:{
            "Content-Type":"application/json"
          },
        withCredentials:true
        }
      ).then((res)=> {
        console.log(res.data);
        setChatData(res.data);
      }).catch((err)=>{
        console.log("Error:error while fetching chats",err.message);
      });
  },[chatStatus]);

    

  useEffect(()=>{
     if(chat?._id){
      socket.emit("join-chat",chat._id);
     }
  },[chat?._id])

  useEffect(()=>{
      socket.on("receive-message",(data)=>{
      setAllMessages((prev)=>[...prev,data]);
     });
     
    //  chatTitleStatus(true);
     return ()=> socket.off("receive-message");
  },[chat?._id])

 useEffect(()=>{
      axios.post("http://localhost:5000/api/v/message/fetch-all-message",
        {chatId:chat?._id},
       {
        headers:{
                "Content-Type":"application/json"
            },
        withCredentials:true 
       }
      ).then((res)=>{
      settypeMessage("");
      setChatTitleStatus(true);
      setAllMessages(res.data);
      console.log(res.data);
      }).catch((err)=>{
        console.log("Error:",err.message)
      })
  },[chat?._id]);
  

  const handleAllUser=async(e)=>{
    setInput(e.target.value);
    if(input.length===1){
      setStatus(false);
    }
    else{
    const response=await axios.get("http://localhost:5000/api/v/chat/fetch-allUser",
    {   
    params:{input},
    headers:{
                "Content-Type":"application/json"
            },
    withCredentials:true   
    }
    );
    console.log(response.data);
    setsearchData(response.data);
    // console.log(searchdata);
    setStatus(true);
  }
}
 const handleLogout=async()=>{
     localStorage.clear();
     await axios.post("http://localhost:5000/api/v/user/logout",
      {},
        {
           headers:{
              "Content-Type":"application/json"
            },
          withCredentials:true
        }
     )
     console.log("user being logout");
     navigate("/login");
    //  window.alert("User logged out");
  }

const handleClick=async(user) =>{
      setAllMessages([]);
      setChat({});
      setChatStatus(false);
      try{

        const singleChat=await axios.post("http://localhost:5000/api/v/chat/access-chat",
          {
            userId:user._id,
          },
          {
           headers:{
              "Content-Type":"application/json"
            },
          withCredentials:true
          }
        )
        console.log(singleChat);
        setChat(singleChat?.data[0]);
        setChatStatus(true);
        setStatus(false);
        setInput("");
    } 
      catch (error) {
          console.log("Error:",error.message);
      }
  
  }

const handleClickForExistedChat=async (value) =>{
      setChat({});
      setChatStatus(false);
      setAllMessages([]);
      const response=await axios.post("http://localhost:5000/api/v/message/fetch-all-message",
        {chatId:value?._id},
       {
        headers:{
                "Content-Type":"application/json"
            },
        withCredentials:true 
       }
      )
      if(Object.keys(chat).length===0){
      await axios.put("http://localhost:5000/api/v/chat/seen-message-status",
      {chatId:value?._id},
      {
       headers:{
                "Content-Type":"application/json"
            },
        withCredentials:true 
      }
     )
     setChatStatus(true);
    }
    //  const chatListResponse=axios.get("http://localhost:5000/api/v/chat/fetch-chatData",
    //     {
    //      headers:{
    //         "Content-Type":"application/json"
    //       },
    //     withCredentials:true
    //     }
    //   )
    //   setChatData(chatListResponse.data);
      setChat(value);
      setAllMessages(response.data);
      
  }

const handleMessageSend=async(chatId,content)=>{
  if(!content.trim()) return;
  const newMsg={
    sender:{_id:data[0]._id},
    messageContent:content,
    chat:chatId
  }
  settypeMessage("");
  setAllMessages(prev=>[...prev,newMsg]);
  socket.emit("send-message",newMsg);
  setMessageStatus(true);
}         



  return (
    <>
    <div className='chat-section'>
    <div className='chat-navbar w-screen flex justify-between items-center'>
         <div className="search-field flex">
                 <input onChange={handleAllUser} className="input" placeholder='Search for user' value={input}/>
                 <img className="search-icon" src="search.png"/>
                 <div className='app-name'>Sampark Banaye</div>
        </div>
        
        <div className='login-user-detail p-2 flex gap-3 justify-end'>
          <img className="dp" src={data && data[0]?.profilePic}/>
          <div className='username text-lg'>
            {data && data[0]?.username}
          </div>
          <button onClick={handleLogout} className='logout-btn'>Logout</button>
        </div>
    </div>

         <div className="popup-box" ref={sideBarRef} style={{display:status?"block":"none"}}> 
           <ul className='list-none m-0 p-0'>
           {  searchdata.map((user,index)=>(
              <li key={index}>
              <div onClick={()=>handleClick(user)} className="result-item user-data flex gap-2">
              <img src={user.profilePic} className='search-dp' />
              <p>{user.username}</p>
              </div>
              </li>
             ))
           }
              
           </ul>
         </div>


    <div className='chat-body-section'>
          <div className='chat-body flex flex-col'>
            <div className='chat-heading flex justify-between p-2'>
              <h5>Chats</h5>
              <div className='create-group' onClick={()=>setModalStatus(true)}>
                  <p>Group Chat</p>   
                  <img className="plus-icon" src="plus.png"/>
              </div>
            </div>

            <div className='chat-page'>
               <ul className='list-none m-0 p-0'>
           {chatData && chatData.map((value,index)=>{
              const otherUser=!value.isGroupChat?value.users.find((u)=>u._id!==data[0]._id):null;
            return (
              <li key={index}>
              <div onClick={()=>handleClickForExistedChat(value)} className="chat-detail">
              <img src={value.isGroupChat?value.groupAdmin.profilePic:otherUser.profilePic} className='search-dp' />
              <div className='current-msg'>
                  <p>{value.isGroupChat?value.chatName:otherUser.username}</p>
                  <p style={{fontWeight:value.seenStatus===false?700:300}}>{value && value.newlyMessage}</p>
              </div>
              </div>
              </li>
            )
           })
          }
          </ul>
          </div>
          </div>   

        <div className="message-page" style={{display:chatStatus?"block":"none"}}>
           <div className='chat-page-window'>
            {
             chat && chat.users && ( 
              // const otherUser=!value.isGroupChat?value.users.find((u)=>u._id!==data[0]._id).username:null;
             <div className="message-person">
             <img className='chat-dp' src={chat.isGroupChat?chat.groupAdmin.profilePic:chat.users[1]?.profilePic}/>
             <p>{chat.isGroupChat?chat.chatName:chat.users.find((u)=>u._id!==data[0]._id).username}</p>
             </div>
             )
            }
          
               <div className='message-window' style={{display:chatTitleStatus?"block":"none"}}>
              {/* <div className='messages'> */}
                <ul className='list-of-message list-none flex flex-col gap-y-1 m-0 p-0' >
                {
                  allMessages && allMessages.map((v,i)=>(
                    <div className={`msg-tab ${v.sender?._id==data[0]._id?"sent":"received"}`}  key={i}>{v.messageContent}</div>
                  ))
                }
                </ul>
              {/* </div> */}
              </div>
              
              <div className='message-enter-section flex flex-row' style={{display:chat?.length!==0?"block":"none"}}>
                  <input type="text" onChange={(e)=>settypeMessage(e.target.value)} className='msg-typing-area' placeholder='Type your message here' value={typeMessage}/>
                  <img onClick={()=>handleMessageSend(chat._id,typeMessage)} className="send-icon" src="send-message.png"/>
              </div>
                
           </div>
        </div>
          </div>
           
    
    <GroupCreationModal modalStatus={modalStatus}/>
  </div>
     </>
  )
}

export default Chat
