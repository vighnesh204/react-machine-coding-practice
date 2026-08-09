import {useState} from "react";

const UseStateHook = () => {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setUserData({...userData, [name]: value});
  };

  const handleIncrement = () => {
    // setCount(count + 1);
    // setCount(count + 1);
    // setCount(count + 1);

    // We will do this instead of above
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  };

  return (
    <div>
      <h3>
        <u>useState Hook</u>
      </h3>
      <h5>Question 1: What is useState in React?</h5>
      {/* 
        useState is a hook in React that allows functional components to manage state by
        declaring state variables and providing a function to update them.
      */}
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>

      <h5>Question 2: Whats the Output and How to fix this?</h5>
      <button onClick={handleIncrement}>Increment by 3</button>
      <h5>
        Question 3: What is Two Way Data Binding and How can you achieve it in
        react?
      </h5>
      {/* 
      - It is a concept that allows the synchronization of data between the model (or state) 
      and the view in both directions.
      - You can achieve it by combining state management with controlled components.
    */}
      <p>Input Value : {value}</p>
      <input value={value} onChange={(e) => setValue(e.target.value)} />

      <h5>
        Question 4: Build a Form containing First name, last name and email. Use
        only one state to manage all fields.
      </h5>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(userData);
        }}
      >
        <input
          placeholder="Enter First Name"
          type="text"
          name="firstName"
          onChange={handleInputChange}
        />
        <input
          placeholder="Enter Last Name"
          type="text"
          name="lastName"
          onChange={handleInputChange}
        />
        <input
          placeholder="Enter Email"
          type="email"
          name="email"
          onChange={handleInputChange}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default UseStateHook;
