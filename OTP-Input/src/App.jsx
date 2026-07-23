import { useEffect, useRef, useState } from "react";

const OTP_DIGITS_COUNT = 5;
const App = () => {
  const [otp, setOtp] = useState(new Array(OTP_DIGITS_COUNT).fill("")); // initialize OTP state with an array of empty strings

  const refOtp = useRef([]); // create a ref to hold the input elements

  useEffect(()=>{
    refOtp.current[0]?.focus();
  }, [])

  const handleOnChange = (value, index) => {
    if (isNaN(value)) return; // only allow numeric input
    // console.log(value);
    const newValue = value.trim();
    const newOtp = [...otp]; // create a copy of the current OTP state
    newOtp[index] = newValue.slice(-1); // take only the last digit entered
    setOtp(newOtp); // update the OTP state with the new value
    newValue && refOtp.current[index + 1]?.focus();
  };

  const handleOnKeyDown = (e, index) =>{
    if(!e.target.value && e.key === "Backspace"){
      refOtp.current[index - 1]?.focus();
    }
  }
 return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center px-4">
      <h1 className="text-3xl font-bold text-center pt-16 tracking-wide">OTP Verification</h1>
      <p className="text-zinc-400 text-sm mt-2 text-center">Enter the code sent to your device</p>

      <div className="flex items-center justify-center gap-3 mt-16">
        {otp.map((input, index) => {
          return (
            <input
              key={index}
              type="text"
              className="w-14 h-14 text-center mx-0 bg-zinc-800 border border-zinc-600 rounded-lg text-2xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 shadow-sm" //caret-transparent
              // maxLength={1}
              ref={(input)=> (refOtp.current[index] = input)} 
              value={otp[index]}
              onChange={(e) => {
                handleOnChange(e.target.value, index);
              }}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;