import React, { createContext, useEffect, useRef, useState } from 'react'
import "./chat.css"
import axios from "axios"
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import GroupCreationModal from './GroupCreationModal.jsx'
import socket from "./socket.js";
import { backendUrl } from '../constantApi.js'
import ChatPage from './ChatPage.jsx'
import MessageModal from './MessageModal.jsx'
import Navbar from './Navbar.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { closeChat, openChat } from '../redux/userSlice.js'
// import io from "socket.io-client";

const Home = () => {
  const navigate=useNavigate();
  const location=useLocation();
  const [refreshToken,setToken]=useState();
  const [modalStatus,setModalStatus]=useState(false);
  const [data,setData]=useState([]);
  const [chatData,setChatData]=useState([]);
  const [searchdata,setSearchData]=useState([]);
  const [input,setInput]=useState("");
  const [status,setStatus]=useState(false);
  const [messageStatus,setMessageStatus]=useState(null);
  const [chat,setChat]=useState({});
  const [chatStatus,setChatStatus]=useState(false);
  const [selectedChat,setSelectedChat]=useState(false);
  const [typeMessage,settypeMessage]=useState("");
  const [chatTitleStatus,setChatTitleStatus]=useState(false);
  const [profileStatus,setProfileStatus]=useState(false);
  const [allMessages,setAllMessages]=useState([]);
  const [unreadChats,setUnreadChats]=useState({});
  const [showChatStatus,setShowChatStatus]=useState(true);
  const messagesEndRef=useRef(null);
  const sideBarRef=useRef();
  const dispatch=useDispatch();
  const userData=useSelector((state)=>state.userDetails.data);
  const currentChat=useSelector((state)=>state.userDetails.currentChat);

  const [showChats, setShowChats] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
      // On larger screens, always show both
      if (window.innerWidth >= 768) {
        setShowChats(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  useEffect(()=>{
  console.log(allMessages);
},[])
  // To remove search user div side bar 
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
// To fetch list of chats
  useEffect(()=>{
       const token=localStorage.getItem("refreshToken");
       setToken(token);
       axios.get(`${backendUrl}/api/v/chat/fetch-chatData`,
          {
           headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${refreshToken}`
            },
          withCredentials:true
          }
        ).then((res)=>{
           setChatData(res.data)
       }).catch((err)=>{
        console.log("Error:error while fetching chats",err.message);
      })
},[]);

useEffect(()=>{
    // socket.to(data.chat).emit("receive-message",{...message,tempId:data._id});
      socket.on("receive-message",(data)=>{
        // if(data.chat===currentChat?._id){
          setAllMessages(prev=>{
             if(data.chat){
                return prev.map(m=>m._id===data.chat?data:m)
             }
             return [...prev,data];
          // messagesEndRef.current?.scrollIntoView({behaviour:"smooth"});
        })

      //  if(data.chat!==currentChat?._id){
      setChatData((prev)=>{
        const chatIndex=prev.findIndex(chat=>chat._id===data.chat);
        if(chatIndex===-1) return prev;
        const updatedChatData=[...prev];
        updatedChatData[chatIndex]={
          ...updatedChatData[chatIndex],newlyMessage:data.messageContent,seenStatus:currentChat?._id?true:false}
        return updatedChatData;
       })
   })
        
        
    //     prev.map((chatItem)=>{
    //     chatItem._id===data.chat?{...chatItem,newlyMessage:data.messageContent,seenStatus:currentChat?._id?true:false}:chatItem
    //   }))
    // })
   
    // socket.on("message-seen",({chatId})=>{
    //    setChatData((prev)=>prev.map(chatItem=>(chatItem?._id===chatId)?{...chatItem,seenStatus:true}:chatItem
    //    ))
    //   })
  
     return ()=>{
       socket.off("receive-message");
      //  socket.off("message-seen");
     }

  },[currentChat?._id])


const handleClick=async(user) =>{
      setInput("");
      setAllMessages([]);
      setStatus(false);
      setChatStatus(false);
      setChatTitleStatus(false);
      const singleChat=await axios.post(`${backendUrl}/api/v/chat/access-chat`,
          {
            userId:user._id,
          },
          {
           headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${refreshToken}`
            },
          withCredentials:true
          }
        )
        // setChat(singleChat.data);
        setChatData(prev=>[singleChat.data,...prev]);
        dispatch(openChat(singleChat.data))
        console.log("new chat will shown here")
        console.log(singleChat);
      
      const response=await axios.post(`${backendUrl}/api/v/message/fetch-all-message`,
        {chatId:singleChat.data._id},
       {
        headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${refreshToken}`
            },
        withCredentials:true 
       }
      )
      // console.log(response.data);
        setAllMessages(response?.data);
        setChatTitleStatus(true);
        setChatStatus(true);
    }     

return (
    <>
    <div className='flex flex-col'>
       <div className='view-profile-section' style={{display:profileStatus?"block":"none"}}>
          <div className='flex justify-start gap-3'>
             <img src="arrow.png" className="arrow-left" onClick={()=>setProfileStatus(false)}/>
            <p className=''>Profile Details</p>
          </div>
           
            <div className='profile-photo'>
              {currentChat && currentChat.users && (
                <>
                <img src={currentChat.isGroupChat?currentChat.groupAdmin.profilePic:currentChat.users[0].profilePic} className='profile-dp'/>
                <p className='profile-name'>{currentChat.isGroupChat?currentChat.chatName:currentChat.users[1].username}</p>
                </>
              )}
            </div>
            <div>
              {
                currentChat && currentChat.isGroupChat && chat.users && (
                  <>
                 <ul className="chat-users-list">
                  {
                    currentChat.users.filter((u)=>u._id!==userData._id).map((value,key)=>(
                      <div className='chat-user-list' key={key}>
                       <img src={value.isGroupChat?value.groupAdmin.profilePic:value.users.profilePic} className='users-dp'/>
                       <li key={key}>{value.isGroupChat?value.chatName:value.users.username}</li>
                       </div>
                    ))
                  }
                   
                 </ul>
                 </>
                )
              }
            </div>
           </div>
      <Navbar data={data} setSearchData={setSearchData} input={input} setInput={setInput} setStatus={setStatus} refreshToken={refreshToken}/>
      
        {/* Search user that you want to start chat with them  */}
      <div className="popup-box" ref={sideBarRef} style={{display:status?"block":"none"}}> 
           <ul className='list-none m-0 p-0'>
           {  searchdata.filter((u)=>u._id!==userData._id).map((user,index)=>(
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

    <div className='flex overflow-hidden m-1'>
       {/* left section part of Application */}
      {/* <div className={`
        ${showChats ? 'block' : 'hidden'}
        md:block md:w-1/3 lg:w-1/4
        h-[50vh] md:h-full
        overflow-auto
        border-r border-gray-200
      `}> */}
      {
        showChatStatus?(
            <ChatPage chatData={chatData} modalStatus={modalStatus} setModalStatus={setModalStatus} data={data} setMessageStatus={setMessageStatus}  setChatTitleStatus={setChatTitleStatus} setChatStatus={setChatStatus} setAllMessages={setAllMessages} allMessages={allMessages} setChatData={setChatData} refreshToken={refreshToken} chat={chat} unreadChats={unreadChats} setUnreadChats={setUnreadChats} setChat={setChat} selectedChat={()=>setSelectedChat(true)} setShowChatStatus={setShowChatStatus}/>
        ):null
      }
          
         
      {/* </div> */}
      {/* Right sectin part of Application */}
      {/* <div className={`
        ${!showChats ? 'block' : 'hidden'}
        md:block md:w-2/3 lg:w-3/4
        h-[50vh] md:h-full
        overflow-auto
      `}> */}
      {
        currentChat?(
          <MessageModal allMessages={allMessages} setAllMessages={setAllMessages} profileStatus={profileStatus} setProfileStatus={setProfileStatus} chat={chat} chatData={chatData} typeMessage={typeMessage} settypeMessage={settypeMessage} data={data} setSelectedChat={setSelectedChat} refreshToken={refreshToken} selectedChat={selectedChat} onBack={()=>{
            dispatch(closeChat())
            setShowChatStatus(true)
          }} setChatData={setChatData} messagesEndRef={messagesEndRef}/>
        ):(null
          // <div className='flex-1 border-[3px] rounded relative bg-[hsl(202,82%,87%,1)] h-[85vh]'>
          // <div className='absolute top-[40%] left-[45%] text-[2rem] '> No chats yet</div>
          // </div>
        )
      }
       

      </div>     
    <GroupCreationModal modalStatus={modalStatus} chatData={chatData} setChatData={setChatData}/>    
</div>
  
     </>
  )
}

export default Home
