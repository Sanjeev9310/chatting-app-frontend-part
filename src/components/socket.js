import {io} from "socket.io-client";
import { backendUrl } from "../constantApi.js";
const socket=io(`${backendUrl}`,{
    withCredentials:true,
});

export default socket;