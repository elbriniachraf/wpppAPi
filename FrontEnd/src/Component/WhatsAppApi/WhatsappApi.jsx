import axios from 'axios'
import React from 'react';

import { useState } from 'react';

function WhatsappApi() {
  const [number, setNumber] = useState();
  const [template, setTemplate] = useState();

  const header = {
    headers: {
      Authorization : `Bearer ${process.env.REACT_APP_FACEBOOK_TOKEN}`,
      Accept: 'application/json,'
    }
  }
  const sendMessage = () => {
      
      const Message ={
        "messaging_product": "whatsapp",
        "to": "212"+number.slice(1,10),
        "type": "template",
        "template": {
        "name": template,
        "language": {
            "code": "en_US"
        }
    }
      }
      axios.post('https://graph.facebook.com/v18.0/277469672113240/messages', Message, header)
      .then((res)=>(
        console.log("Message send success", res)
      ))
      .catch((err)=>(
        console.log("Error " ,err)
      ))
  }
    return (
        <div className="lg:flex lg:justify-between justify-between px-8 py-12">

            <div className="lg:w-1/2">
            <div className="max-w-md mx-auto p-6 border ">
      <h1 className="text-xl font-semibold mb-4">Send message</h1>
      <form className="flex flex-col gap-4 text-start ">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm text-gray-500 py-2">WhatsApp Number</label>
          <input onChange={(e)=>setNumber(e.target.value)} type="text" id="name" name="name" placeholder=" "  className="border-b border-gray-300 focus:outline-none focus:border-black" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="text" className="text-sm text-gray-500 py-2">Template message</label>
          <input onChange={(e)=>setTemplate(e.target.value)} type="text" id="name" name="name" placeholder=" "  className="border-b border-gray-300 focus:outline-none focus:border-black" />
        </div>
        <button type="submit" className="bg-black text-white py-2 px-4  hover:bg-gray-800 transition-colors" onClick={sendMessage}>Submit</button>
      </form>
    </div>
            </div>

            
        </div>
    );
}

export default WhatsappApi;