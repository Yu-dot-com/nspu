import React from 'react'

const Avatar = () => {
  return (
    <div>
        <div className="flex flex-col -mt-10 justify-center">
              <img alt="Profile" className="w-48 h-40" />
            </div>

            <div className="-mt-16">
              <hr className="text-gray-400 border-gray-500 bg-gray-500 mt-2 m-3" />
              <h1 className="text-[13px] text-center font-light mt-2">
                You can manage your profile like updating avatar , changing
                password and others
              </h1>
            </div>
    </div>
  )
}

export default Avatar