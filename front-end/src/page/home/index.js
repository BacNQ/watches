import Image from "next/image";
export default function Home() {
    return (
      <div className='page-home'>
        <Image src={'/logo/logo.png'} width={300} height={300} alt="B&Q Watches"/>
      </div>
    );
  }