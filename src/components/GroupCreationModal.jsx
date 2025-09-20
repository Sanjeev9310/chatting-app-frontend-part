import axios from 'axios';
import React, { useState } from 'react'
import "./GroupCreation.css"
import { useRef } from 'react';

const GroupCreationModal = ({modalStatus}) => {
  const val=useRef(null);
    const [groupData,setGroupData]=useState({
        chatName:"",
        usersId:[]
    })
    const [searchdata,setsearchData]=useState([]);
    // const [modalStatus,setModalStatus]=useState(true);
    const [input,setUserInput]=useState("");
    const [groupUserStatus,setGroupUserStatus]=useState(false);
    const [listUser,setUserList]=useState([]);
    const [listStatus,setlistStatus]=useState(false);
    
  const handleSearchUser=async(e)=>{
    setUserInput(e.target.value);
    if(input.length===1){
      setGroupUserStatus(false);
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
    
    setsearchData(response.data.slice(0,6));
    setGroupUserStatus(true);
  }
}
const handleGroup=async()=>{
    const response=await axios.post("http://localhost:5000/api/v/chat/create-groupChat",
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
  console.log(response.data);
}

const addUserIntoList=async(username,userId)=>{
      setUserList(prevList=>[...prevList,username]);
      setGroupData(prevData=>({...prevData,
            usersId:[...prevData.usersId,userId]
        }))
        setlistStatus(true);
        setUserInput("");
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
        <input onChange={(e)=>handleSearchUser} placeholder="Search user you want to add" className='adding-user' value={input}/>

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
        <div className="users-list" style={{display:groupUserStatus?"block":"none"}}>
            <ul className='list-none m-0 p-0'>
           {  searchdata.map((value,index)=>(
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


//   const user=await axios.get("http://localhost:5000/api/v/chat/fetch-singleUser",
    //     {username},
    //     {
    //      headers:{
    //             "Content-Type":"application/json"
    //         },
    //    withCredentials:true   
    //    }
    // )