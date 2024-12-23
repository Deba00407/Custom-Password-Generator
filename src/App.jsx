import { useState, useCallback, useEffect } from "react"
import lightMode from './assets/light-mode.png'
import darkMode from './assets/dark-mode.png'
import SavedPasswords from "./SavedPasswords"

function App() {

  let [length, setLength] = useState(8)
  let [numbers, setNumbers] = useState(false)
  let [specialChars, setSpecialChars] = useState(false)
  let [password, setPassword] = useState("")
  let [toggle, setToggle] = useState(false) // False for light-mode
  let [savedPasswords, setSavedPasswords] = useState(false)
  let [message, setMessage] = useState('')

  // Caching the password during re-renders
  const passwordGenerator = useCallback(() => {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (numbers) charset += "0123456789"
    if (specialChars) charset += "!@#$%^&*()_+"

    let password = ""
    for (let i = 0; i < length; i++) {
      let position = Math.floor(Math.random() * charset.length + 1)
      password += charset.charAt(position)
    }

    setPassword(password)

  }, [length, numbers, specialChars, setPassword])

  // To efficiently generate password on any change
  useEffect(() => {
    passwordGenerator()
  }, [length, numbers, specialChars, passwordGenerator])

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    const existingPasswords = JSON.parse(localStorage.getItem('passwords')) || [];
    existingPasswords.push(password);
    localStorage.setItem('passwords', JSON.stringify(existingPasswords));
    setSavedPasswords(false);
    setMessage('Password copied!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <>
      {/* Toggle Background color */}
      <div className={`flex justify-center items-center w-full p-4 ${toggle ? 'bg-black' : 'bg-gray-100'}`}>
        <div className="flex items-center bg-gray-200 rounded-full shadow-md p-2">
          <button
            onClick={() => setToggle(!toggle)}
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full focus:outline-none transition-transform transform"
            style={{ transform: toggle ? 'translateX(50px)' : 'translateX(0)' }}
          >
            <img src={toggle ? darkMode : lightMode} alt="toggle" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Password Generator */}
      <div className={`flex flex-col items-center p-4 space-y-6 min-h-screen ${toggle ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
        <div className="flex items-center w-full max-w-md space-x-2">
          <input
            type="text"
            readOnly
            value={password}
            className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-200 text-gray-700 cursor-default"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Copy
          </button>
        </div>


        <div className="w-full max-w-md">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password Length
          </label>
          <input
            type="range"
            value={length}
            min="8"
            max="32"
            defaultValue="8"
            className="w-full"
            onChange={(e) => setLength(e.target.value)}
          />
          <div className="text-sm text-gray-600 mt-1">{length} characters</div>
        </div>


        <div className="flex flex-col space-y-3 w-full max-w-md">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              onChange={() => setNumbers((prev) => !prev)}
            />
            <span className="text-sm text-gray-700">Include Numbers</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              onChange={() => setSpecialChars((prev) => !prev)}
            />
            <span className="text-sm text-gray-700">Include Special Characters</span>
          </label>
        </div>

        {/* Saved Passwords */}
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={() => setSavedPasswords((prev) => !prev)}>{savedPasswords ? 'Hide copied passwords' : 'Display previously copied passwords'}</button>
        {savedPasswords && <SavedPasswords />}

        {/* Message */}
        {message && <div className="text-center text-green-500">{message}</div>}
      </div>

    </>
  )
}

export default App
