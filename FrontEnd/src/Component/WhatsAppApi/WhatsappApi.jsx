import axios from 'axios';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';

function WhatsappApi() {
  const [numbers, setNumbers] = useState([]);
  const [template, setTemplate] = useState('');
  const [languageCode, setLanguageCode] = useState('en_US'); 
  const [fileName, setFileName] = useState('No file chosen'); 
  const [sending, setSending] = useState(false); 
  const [fileError, setFileError] = useState(''); 
  const [templateError, setTemplateError] = useState(''); 

  const notifyFailure = () => swal({
    title: 'Message sending failed.',
    text: 'There was an error while sending messages.',
    icon: 'error',
    button: 'close',
    className: 'alert',
  });

  const notifySuccess = () => swal({
    title: 'Messages sent successfully.',
    icon: 'success',
    button: 'close',
    className: 'alert',
  });

  const header = {
    headers: {
      Authorization: `Bearer EAAFeCJoUvOgBOwQhcy7SWY9B2VtZCTebEValzGBapTfv2T7ObsswgpsQg5bBiqF4YmKhNDSaQGGXVPJlW03vSQKR4mErFMLrbAqxDrZBF3Y8nT8SZCSXEBNnoBhgYqw5DdkZCNZAQuuESVGnV8trvWkqsjR8FfIsuMwxEsfWbJefjWYLojx75WylSBLyZCJA5QLyhDdrtGifZBbJWua`,
      Accept: 'application/json',
    },
  };

  useEffect(() => {
    console.log('Extracted numbers:', numbers);
  }, [numbers]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileError('Please select a file.');
      return;
    }
    setFileName(file.name); // Update the file name
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const range = XLSX.utils.decode_range(sheet['!ref']);

      const extractedNumbers = [];
      for (let i = range.s.r; i <= range.e.r; i++) {
        const cellAddress = XLSX.utils.encode_cell({ r: i, c: 0 });
        const cell = sheet[cellAddress];
        if (cell && cell.t === 's') {
          extractedNumbers.push(cell.v);
        }
      }

      setNumbers(extractedNumbers);
    };

    reader.onerror = (event) => {
      setFileError('Error reading file.');
    };

    reader.readAsArrayBuffer(file);
    e.target.value = null; // Clear the input field to force triggering the onChange event
  };

  const sendMessage = async () => {
    // Clear previous errors
    setFileError('');
    setTemplateError('');

    if (numbers.length === 0) {
      setFileError('No numbers extracted.');
      return;
    }
    if (!template) {
      setTemplateError('Please enter a template name.');
      return;
    }

    setSending(true); // Start sending

    try {
      for (const number of numbers) {
        const message = {
          messaging_product: 'whatsapp',
          to: number.slice(2, 14),
          type: 'template',
          template: {
            name: template,
            language: {
              code: languageCode,
            },
          },
        };
        console.log(message);
        await axios.post(
          `https://graph.facebook.com/${process.env.REACT_APP_VERSION_API}/${process.env.REACT_APP_PHONE_NUMBER_ID}/messages`,
          message,
          header
        );
        notifySuccess();
        console.log('Message sent to', number);
      }
      console.log('Messages sent successfully.');
    } catch (error) {
      notifyFailure();
      console.error('Error sending messages:', error);
    } finally {
      setSending(false); // Finish sending
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border">
      <h1 className="text-xl font-semibold mb-4">Send message</h1>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} className='text-white'/>
      {fileError && <div className="text-red-600">{fileError}</div>}
      <div className="text-blue-700 py-2">
        {fileName} {/* Display the file name */}
      </div>
      <div className="flex flex-col">
        <label htmlFor="text" className="text-sm text-gray-500 py-2">
          Template name
        </label>
        <input
          onChange={(e) => setTemplate(e.target.value)}
          type="text"
          id="text"
          name="text"
          placeholder="Enter template name"
          className="border-b border-gray-300 py-3 focus:outline-none focus:border-black"
        />
        {templateError && <div className="text-red-600">{templateError}</div>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="language" className="text-sm text-gray-500 py-2">
          Template Language
        </label>
        <select
          id="language"
          name="language"
          value={languageCode}
          onChange={(e) => setLanguageCode(e.target.value)}
          className="border border-gray-300 p-3 my-2 focus:outline-none focus:border-black"
        >
          <option value="en_US">English</option>
          <option value="fr">French</option>
          <option value="ar">Arabic</option>
        </select>
      </div>
      <button
        type="button"
        disabled={sending} // Disable the button while sending
        className={`bg-black text-white py-2 px-4 w-full hover:bg-gray-800 transition-colors ${sending && 'opacity-50 cursor-not-allowed'}`}
        onClick={sendMessage}
      >
        {sending ? 'Sending messages...' : 'Submit'}
      </button>
    </div>
  );
}

export default WhatsappApi;
