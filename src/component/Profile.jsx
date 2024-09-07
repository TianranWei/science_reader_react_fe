import React from 'react';

import readerIcon from "../asset/sReader.png"
const Profile = () => {
  return (
    <div className='mx-80 px-10 py-4 flex flex-col justify-center items-center'>
        <img src={readerIcon} className='h-22 w-32'></img>
        <div className='p-1'>
            <h2 className='text-2xl font-bold text-black font-serif text-center'>Science Reader</h2>
            <p className='text-[#50b2fe] font-bold text-xl font-poppins text-center uppercase'>
                Ai powered paper reader
            </p>
        </div>
        
      
    </div>
  );
}

export default Profile;
