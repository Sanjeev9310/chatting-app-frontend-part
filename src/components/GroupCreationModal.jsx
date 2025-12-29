import axios from 'axios';
import React, { useState } from 'react'
import "./GroupCreation.css"
import { useRef } from 'react';
import { backendUrl } from '../constantApi.js';

const GroupCreationModal = ({modalStatus,chatData,setChatData}) => {
  // const val=useRef(null);
  const groupName=useRef();
    const [groupData,setGroupData]=useState({
        chatName:"",
        usersId:[]
    })
    const [searchdata,setsearchData]=useState([]);
    // const [groupName,setGroupName]=useState("");
    // const [modalStatus,setModalStatus]=useState(true);
    const [input,setUserInput]=useState("");
    const [groupUserStatus,setGroupUserStatus]=useState(false);
    const [listUser,setUserList]=useState([]);
    const [listStatus,setlistStatus]=useState(false);
    
const handleSearchUser=async(e)=>{
    const value=e.target.value;
    setUserInput(value);
    // console.log(e.target.value);
    const response=await axios.get(`${backendUrl}/api/v/chat/fetch-allUser?input=${input}`,
   {   
    headers:{
                "Content-Type":"application/json"
            },
    withCredentials:true   
    }
    );
    console.log(response.data);
    setsearchData(response.data.slice(0,6));
    setGroupUserStatus(true);
  
}
const handleGroup=async()=>{
    try {
      const response=await axios.post(`${backendUrl}/api/v/chat/create-groupChat`,
          {
              chatName:groupData.chatName,
              usersId:groupData.usersId
          },
          {
             headers:{
                  "Content-Type":"application/json"
              },
            withCredentials:true   
         } 
    )
       setChatData(prev=>[response.data[0],...prev]);
    } 
    catch (error){
      console.log(error.response.data.message);
        if(error.response && error.response.data){
            groupName.current.innerText=error.response.data.message;
         }
         else{
           groupName.current.innerText="unexpected error";
         }
    }
}

const addUserIntoList=async(username,userId)=>{
      setUserList(prevList=>[...prevList,username]);
      setGroupData(prevData=>({...prevData,
            usersId:[...prevData.usersId,userId]
        }))
        setlistStatus(true);
        setUserInput("");
        setGroupUserStatus(false);
        }

const removeUserFromGroup=(e)=>{
    //  let currentChatId=chat?._id;
    const user=e.target.innerText;
    setUserList(prevList=>prevList.filter((u)=>u!==user))
}
   
  return (
    <div className='group-chat-model' style={{display:modalStatus?"block":"none"}}>
      <form className='form flex gap-y-2'>
        <h2>Create Group</h2>
        <input onChange={(e)=>setGroupData({...groupData,chatName:e.target.value})} placeholder='Group Name' className='group-name' value={groupData.chatName}/>
        <input onChange={(e)=>handleSearchUser(e)} placeholder="Search user you want to add" className='adding-user' value={input}/>

        <div style={{display:listStatus?"block":"none"}}>
          <ul className="group-user-div">
           {
           listUser.map((username,index)=>( 
            <li onClick={()=>removeUserFromGroup} key={index} className='group-user-list flex gap-x-1'>{username}
            <img src="cross.png" className='cross-icon'/></li>
            
           ))
          }
          </ul>
        </div>
        <span ref={groupName}></span>
        <div className="users-list" style={{display:groupUserStatus?"block":"none"}}>
            <ul className='list-none m-0 p-0'>
           { searchdata && searchdata.map((value,index)=>(
              <li key={index}>
              <div className="users-div">
                 <img src={value.profilePic} className='search-dp' />
                 <p onClick={()=>addUserIntoList(value.username,value._id)}>{value.username}</p>
              </div>
              </li> 
             )) 
             }
              
           </ul>
        </div>
        <button onClick={handleGroup} type="submit">Create New group</button>
      </form>
    </div>
  )
}

export default GroupCreationModal
