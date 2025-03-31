import React from 'react'

const Button = ({type , tag}) => {
  return (
    <button type={type} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 transition-all">
   {tag}
</button>

  )
}

export default Button