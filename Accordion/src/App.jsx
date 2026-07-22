import Accordion from './components/Accordion'

const App = () => {
  const data = [
  {
    title: "Components",
    description: "Reusable building blocks used to create React user interfaces.",
  },
  {
    title: "Props",
    description: "Used to pass data from a parent component to a child component.",
  },
  {
    title: "State",
    description: "Stores and manages dynamic data inside a React component.",
  },
  {
    title: "Hooks",
    description: "Functions that let you use state and other React features.",
  },
  {
    title: "Virtual DOM",
    description: "Helps React efficiently update only the required parts of the UI.",
  },
];
  return (
    <div>
      <Accordion data = {data}/>
    </div>
  )
}

export default App