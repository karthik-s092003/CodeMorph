import Navbar from "./navbar"
import { TypeAnimation } from 'react-type-animation';
import "../index.css"

function HomePage() {
    return<div className="h-screen overflow-hidden backgroundimage text-white ">
        <Navbar/>
        <div className=" flex justify-center items-center flex-col gap-10 h-full  " >

       
        <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'Share Your Code !!',
        1000, // wait 1s before replacing "Mice" with "Hamsters"
        'Convert Your Code !! ',
        1000,
        'Correct Your code !! ',
        1000,
        
      ]}
      wrapper="span"
      speed={50}
      style={{  fontSize: '4em', display: 'inline-block' }}
      repeat={Infinity}
    /> 

    <p className="max-w-[600px] font-semibold  ">
    Welcome to CodeMorph, your ultimate coding hub! CodeMorph offers a live code-sharing platform for real-time collaboration, seamless code conversion between programming languages, and intelligent code correction to fix errors and optimize your work. Revolutionize your coding experience with CodeMorph today!
    </p>
    </div>
    </div>
}

export default HomePage