import Image from 'next/image';
import { FC } from 'react';

const LoadingSpinner: FC = () => {
  return (
    <div className="relative  bg-black overflow-hidden">

      {/* Loading spinner centered */}
      <div className="relative z-10 flex justify-center items-center h-screen">
        <div className="w-64 h-64 rounded-xl overflow-hidden ">
          <Image
            src="/gojo-loading.gif"
            alt="Loading..."
            width={256}
            height={256}
            className="object-cover scale-150 w-full invert h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;