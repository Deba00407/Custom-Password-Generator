import React from 'react'
import { useState, useEffect } from 'react'

export default function SavedPasswords() {
    let [passwords, setPasswords] = useState([])
    let [message, setMessage] = useState('')
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;


    useEffect(() => {
        const data = localStorage.getItem('passwords')
        if (data) {
            setPasswords(JSON.parse(data))
        }
    }, [])

    const removePassword = (index) => {
        const newPasswords = passwords.filter((_, i) => i !== index)
        setPasswords(newPasswords)
        localStorage.setItem('passwords', JSON.stringify(newPasswords))
        setMessage('Password removed!')
        setTimeout(() => setMessage(''), 2000)
    }

    const visiblePasswords = passwords.slice(startIndex, endIndex);

    const handleCopy = () => {
        navigator.clipboard.writeText(passwords);
        setMessage('Password copied!');
        setTimeout(() => setMessage(''), 2000);
    };

    const handleNext = () => {
        if (endIndex < passwords.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="flex flex-col items-center p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-screen bg-transparent text-gray-800 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 max-w-lg">
            <span className="text-base sm:text-lg font-semibold text-gray-700">
                Copied Passwords
            </span>
            <ul className="w-full bg-white rounded-lg shadow-md p-4">
                {visiblePasswords.length > 0 ? (
                    visiblePasswords.map((password, index) => (
                        <li
                            key={index}
                            className="text-sm sm:text-base text-gray-600 py-2 border-b border-gray-200 last:border-none flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
                        >
                            {password}
                            <div className="buttons flex flex-wrap justify-between items-center gap-2">
                                <button
                                    className="px-3 py-2 text-xs sm:text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                    onClick={handleCopy}
                                >
                                    Copy
                                </button>
                                <button
                                    className="px-3 py-2 text-xs sm:text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                                    onClick={() => removePassword(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-gray-500 text-center py-2 flex items-center justify-center h-24">
                        No passwords copied yet.
                    </li>
                )}
                {/* Pagination Controls */}
                <div
                    className={`flex justify-between items-center gap-2 mt-4 ${passwords.length > 0 ? 'block' : 'hidden'
                        }`}
                >
                    <button
                        className="px-3 py-2 text-xs sm:text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handlePrev}
                        disabled={currentPage === 0}
                    >
                        Prev
                    </button>
                    <button
                        className="px-3 py-2 text-xs sm:text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleNext}
                        disabled={endIndex >= passwords.length}
                    >
                        Next
                    </button>
                </div>
            </ul>

            {/* Message */}
            {message && (
                <div className="text-center text-sm sm:text-base text-green-500">
                    {message}
                </div>
            )}
        </div>


    )
}

