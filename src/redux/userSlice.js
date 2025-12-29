import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'userDetails',
  initialState: {
    data:null,
    currentChat:null
  },
  reducers:{
    loginDetails:(state, action)=>{
        state.data=action.payload
    },
    logout:(state)=>{
      state.data=null;
      state.currentChat=null;
    },
    openChat:(state,action)=>{
        state.currentChat=action.payload;
    },
    closeChat:(state)=>{
        state.currentChat=null;
    },
  } 
})

export const { loginDetails, logout,openChat,closeChat } = userSlice.actions
export default userSlice.reducer