import React from 'react';
import Profile from './component/Profile';
import UploadAndViewPDF from './component/UploadAndViewPDF';

const Chat = () => {
   
        return (
        <div className='h-full flex items-center justify-center flex-auto flex-col'>
            <Profile/>
            <UploadAndViewPDF />
        </div>
        )
}

export default Chat;
