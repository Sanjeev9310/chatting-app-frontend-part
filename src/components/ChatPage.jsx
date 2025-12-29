import React, { useEffect, useState } from 'react'
import "./chat.css"
import { backendUrl } from '../constantApi'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { openChat } from '../redux/userSlice'
import socket from './socket.js'

const ChatPage = ({chatData,modalStatus,setModalStatus,setMessageStatus,unreadChats,setUnreadChats,setChatTitleStatus,setChatStatus,allMessages,setAllMessages,refreshToken,selectedChat,setChatData,setShowChatStatus}) => {
  const navigate=useNavigate();
  // const [isSeen,setIsSeen]=useState(true);
  const dispatch=useDispatch();
  const userData=useSelector((state)=>state.userDetails.data);
  const currentChat=useSelector((state)=>state.userDetails.currentChat);
  // useEffect(()=>{
    
  // },[currentChat])

    const handleClickForExistedChat=async (value) =>{
      // {isMobile && setShowChats(false)}
      setShowChatStatus(false)
      dispatch(openChat(value))
      socket.emit("join-chat",value._id);
      socket.emit("seen",value._id);    
      setChatTitleStatus(true);
      setChatStatus(true);
      setMessageStatus(true);
    
      const msg=await axios.post(`${backendUrl}/api/v/message/fetch-all-message`,
        {chatId:value?._id},
       {
        headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${refreshToken}`
            },
        withCredentials:true 
       }
      )
      setAllMessages(msg.data);
      // setShowChatOnMobile(true);
      console.log(msg.data);
 }
  return (
       <div className='chat-page w-[100vw] h-[80vh] border-blue-500 border-3 rounded overflow-y-scroll bg-[hsl(202,82%,87%)] overflow-hidden'>
            <div className='flex justify-between p-2  bg-[rgb(209,222,233)] '>
              <h5>Chats</h5>
              <div className='create-group' onClick={()=>!modalStatus?setModalStatus(true):setModalStatus(false)}>
                  <p>Group Chat</p>   
                  <img className="plus-icon" src="plus.png"/>
              </div>
            </div>

            <div>
               <ul className='list-none m-0 p-0'>
           { chatData && chatData.map((value)=>{
              const otherUser=(!value?.isGroupChat)?value?.users?.find((u)=>u._id!==userData?._id):null;
            return (
              <li key={value?._id}>
              <div className="pl-[10px] flex gap-[0.7rem] hover:bg-[rgb(111,239,130)]" onClick={()=>handleClickForExistedChat(value)}>
              <img src={(value?.isGroupChat)?value.groupAdmin.profilePic:otherUser?.profilePic} className='search-dp' />
              <div className='flex flex-col w-max h-min '>
                  <p className="semi-bold">{(value?.isGroupChat)?value.chatName:otherUser?.username}</p>
                  {/* <p style={{fontWeight:value.seenStatus?300:700}}>{value && value.newlyMessage}</p> */}
                   <p style={{fontWeight:value?.seenStatus?300:700}}>{value && value.newlyMessage}</p>
              </div>
              </div>
              </li>
            )
           })
          }
          </ul>
          </div>
    </div>
  )
}

export default ChatPage
