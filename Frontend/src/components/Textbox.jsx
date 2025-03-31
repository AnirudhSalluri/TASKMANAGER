import React from 'react'

const Textbox = React.forwardRef(({name , error , register , placeholder , type , },ref) => {
  return (
    <div className='w-full flex flex-col gap-1 '>
        <input 
            name={name}
            type={type}
            placeholder={placeholder}
            ref={ref}
            {...register}
            aria-invalid={error?'true':'false'}
            className='w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none'
        />
        {error&&(
            <span className='text-red-500 text-sm mt-1'>{error}</span>
        )}
    </div>
  )
})

export default Textbox