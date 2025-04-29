import React from 'react';
import page404Image from '../assets/page404.jpg';

const Page404 = () => {

  return (
    <div className="relative w-full h-[calc(100vh-120px)] overflow-hidden"> 
      <img
        src={page404Image}
        alt="404 Not Found"
        className="w-full h-full object-contain"
      />
      
    </div>
  );
};

export default Page404;
