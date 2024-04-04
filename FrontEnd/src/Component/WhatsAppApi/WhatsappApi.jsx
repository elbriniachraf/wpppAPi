import axios from 'axios';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';

function WhatsappApi() {
  const [numbers, setNumbers] = useState([]);
  const [template, setTemplate] = useState('');

  const notify = () => swal(
    {
      title: 'Messages sent successfully.',
      icon: 'success',
      button: 'close',
      className: 'alert',
    }
  );

  const header = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_WHATSAPP_TOKEN}`,
      Accept: 'application/json',
    },
  };

  useEffect(() => {
    console.log('Extracted numbers:', numbers); // Move this logging inside the useEffect hook
  }, [numbers]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Assuming the numbers are in the first column of the first sheet
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const range = XLSX.utils.decode_range(sheet['!ref']);
  
      const extractedNumbers = [];
      for (let i = range.s.r; i <= range.e.r; i++) {
        const cellAddress = XLSX.utils.encode_cell({ r: i, c: 0 });
        const cell = sheet[cellAddress];
        if (cell && cell.t === 'n') { // Check if cell contains a number
          extractedNumbers.push(cell.v);
        }
      }
      
      setNumbers(extractedNumbers); // Set the extracted numbers
    };
  
    reader.readAsArrayBuffer(file);
  
    // Clear the input field to force triggering the onChange event
    e.target.value = null;
  };
  
  

  const sendMessage = async () => {
    if (numbers.length === 0) {
      console.error('No numbers extracted.');
      return;
    }

    try {
      for (const number of numbers) {
        const message = {
          messaging_product: 'whatsapp',
          to: `212${number}`, 
          type: 'template',
          template: {
            name: template,
            language: {
              code: 'en_US',
            },
          },
        };

        await axios.post(
          `https://graph.facebook.com/${process.env.REACT_APP_VERSION_API}/${process.env.REACT_APP_PHONE_NUMBER_ID}/messages`,
          message,
          header
        );

        console.log('Message sent to', number);
      }
      notify();
      console.log('Messages sent successfully.');
      
    } catch (error) {
      console.error('Error sending messages:', error);
    }
  };

  return (
    <div className="lg:flex lg:justify-between justify-between px-8 py-12">
      <div className="lg:w-1/2">
        <div className="max-w-md mx-auto p-6 border">
          <h1 className="text-xl font-semibold mb-4">Send message</h1>
          <input type="file" accept=".xlsx" onChange={handleFileUpload} />
          <div className="flex flex-col">
            <label htmlFor="text" className="text-sm text-gray-500 py-2">
              Template message
            </label>
            <input
              onChange={(e) => setTemplate(e.target.value)}
              type="text"
              id="text"
              name="text"
              placeholder="Enter template message"
              className="border-b border-gray-300 py-4 focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="button"
            className="bg-black text-white py-2 px-4 w-full hover:bg-gray-800 transition-colors"
            onClick={sendMessage}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default WhatsappApi;
