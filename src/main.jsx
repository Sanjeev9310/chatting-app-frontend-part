import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import {Provider} from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import {store,persistor} from "./redux/store.js";
import { BrowserRouter } from 'react-router';
// import { AuthProvider } from './components/AuthContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(

     <BrowserRouter>
         {/* <AuthProvider> */}
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App/>
                </PersistGate>
            </Provider>
         {/* </AuthProvider> */}
     </BrowserRouter>
)
