import React, { useEffect } from 'react'
import socket from "./socket.js";
import { useLocation, useNavigate } from 'react-router';
import "./chat.css"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { backendUrl } from '../constantApi.js';

const MessageModal = ({allMessages,setAllMessages,profileStatus,setProfileStatus,chat,chatData,typeMessage,settypeMessage,data,selectedChat,setChatData,refreshToken,onBack,messsagesEndRef}) => {
  // const location=useLocation();
  // const navigate=useNavigate();
  const currentChat=useSelector((state)=>state.userDetails.currentChat);
  const userData=useSelector((state)=>state.userDetails.data);
   useEffect(()=>{
     socket.on("receive-message",(data)=>{
       if(data.chat===currentChat?._id){
          setAllMessages(prev=>[...prev,data])
       }
     })
},[currentChat?._id])

  const handleMessageSend=async(chatId,content)=>{
    if(!content.trim()) return;
    const tempId=Date.now()+Math.random();
    const newMsg={
      // tempId,
      _id:tempId,
      sender:{_id:userData?._id},
      messageContent:content,
      chat:chatId
    }
    setAllMessages(prev=>[...prev,newMsg]);
    console.log(allMessages);
    settypeMessage("");
    setChatData((prev)=>prev.map((chatItem)=>chatItem._id===chatId?{
      ...chatItem,newlyMessage:content,seenStatus:true
     }:chatItem
    ))
    socket.emit("send-message",newMsg);
    // setMessageStatus(true);
  }    

  return (
      <div className='w-[100vw] h-[80vh] border-[3px] rounded bg-[hsl(202,82%,87%,1)] p-1 relative overflow-hidden'>
          {/* <div className='chat-page-window'> */}
              <div className='message-person flex gap-[0.65rem]'>
               <img onClick={onBack} className="md:hidden w-[1rem] h-[1rem] mt-2 cursor-pointer" src="arrow.png"/>
         
            {
             currentChat && currentChat.users && ( 
              // const otherUser=!value.isGroupChat?value.users.find((u)=>u._id!==data[0]._id).username:null;
             
             <div className="flex gap-2" onClick={()=>setProfileStatus(true)}>
             <img className='chat-dp' src={currentChat.isGroupChat?currentChat.groupAdmin.profilePic:currentChat.users.find((u)=>u._id!==userData._id).profilePic}/>
             <p>{currentChat.isGroupChat?currentChat.chatName:currentChat.users.find((u)=>u._id!==userData._id).username}</p>
             </div>
             )
            }
            </div>
            
            <div className="message-window overflow-auto h-[82%]">
                <ul className='list-of-message list-none flex flex-col gap-y-1 m-0 p-0' >
                {
                  allMessages && allMessages.map((v,i)=>(
                    <div key={i} className={`msg-div flex ${v.sender?._id===userData._id?"sent-div":"received-div"}`}>
                  {
                    currentChat?.isGroupChat?(
                      <img className="user-photo" src={userData?.profilePic}/>
                    ):null
                  }
                    <div className={`msg-tab ${v.sender?._id==userData._id?"sent":"received"}`}  key={i}>
                      {v.messageContent}</div>
                    </div>
                  ))
                }
                </ul>
                <div ref={messsagesEndRef}/>
              </div>
              
            <div className='absolute bottom-0 w-full pb-2' style={{display:chatData?.length!==0?"block":"none"}}>
                <div className='msg-typing-area'>
                  <input type="text" className="w-full h-[2rem] sm:h-[1.5rem]" onChange={(e)=>settypeMessage(e.target.value)} placeholder='Type your message here' value={typeMessage}/>
                  <img onClick={(e)=>e.key==="Enter"?handleMessageSend(currentChat?._id,typeMessage):handleMessageSend(currentChat?._id,typeMessage)} className="w-[1.6rem]" src="send-message.png"/>
                </div>
              </div>
            
                
          {/* </div> */}
      </div>
  )
}

export default MessageModal
