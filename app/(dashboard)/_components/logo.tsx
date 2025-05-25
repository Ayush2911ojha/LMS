import Image from 'next/image'
export const Logo = () => {
  return (
    <div className='flex items-center justify-center w-36 h-24 bg-blue-100 rounded-2xl shadow-lg p-2 hover:scale-105 transition-all duration-300'>
      <Image
        // src="/logo.svg"
        src='/newLogo1.png'
        alt='logo'
        width={100}
        height={100}
        className='object-contain'
      />
    </div>
  )
}
