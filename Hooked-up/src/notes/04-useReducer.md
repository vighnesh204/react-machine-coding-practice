Question 1: What is useReducer in react ?
=> It is a hook used for managing complex state logic by utilizing a reducer function.
=> Alternative to useState and provide a way to update state based on defined actions

Question 2: When should you use useReducer insted of useState ?
=> When managing complex state transitions or logic that involves multiple sub-values.
=> When state logic follows a pattern or when multiple actions need to update the state in predictable ways.

Question3 : Give Example of useReducer for shopping Cart state management ?


# useReducer Hook 

---

### Q1. `useReducer` kya hai aur yeh exist kyu karta hai jab `useState` already hai?

Dekho, sabse pehle samjho — `useState` **simple state** ke liye perfect hai, jaise ek counter ya ek boolean toggle. Lekin jaise-jaise state **complex** hoti jaati hai — matlab **multiple related sub-values** hain, updates **ek dusre pe depend** karte hain, ya bahut saare **alag-alag "actions"** state ko modify kar sakte hain — tab `useState` se code **messy** ho jata hai. Bahut saare scattered `setX` calls, aur update logic **components ke andar bikhri hui** hoti hai.

`useReducer` isi problem ko solve karta hai. Yeh **Redux ke "reducer pattern"** se inspired hai — saari state update logic **ek centralized function** (reducer) me rehti hai, aur components sirf **"kya action hua"** batate hain (dispatch karte hain), **"state kaise badlegi"** wo unka concern hi nahi hota.

```jsx
const [state, dispatch] = useReducer(reducerFunction, initialState)
```

**Mental model samjho:** Socho `dispatch` ek **"request bhejna"** hai — *"yeh action hua hai."* Reducer function ek **"judge"** hai jo dekhta hai *"is action ke liye naya state kya hona chahiye"* aur naya state return karta hai. Component ko sirf **"kya hua"** pata hota hai, **"kaise handle hoga"** uska matlab nahi.

---

### Q2. Reducer function ka exact structure/contract kya hota hai? Yeh function kaisa hona chahiye?

Yeh ek **bahut important technical detail** hai — reducer function **ek specific shape** follow karta hai:

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
```

**Contract yeh hai:**
1. **Do parameters leta hai:** `state` (current state) aur `action` (jo `dispatch()` se aaya object hai)
2. **Hamesha naya state RETURN karta hai** — kabhi bhi `state` ko directly mutate nahi karta
3. **`default` case zaroori hai** — agar `action.type` kuch match nahi kare, **purana state as-it-is return** karo, warna React ko pata hi nahi chalega kya karna hai

**Curious sawaal — reducer ko "PURE FUNCTION" kyu hona chahiye?**

**Pure function** ka matlab — same input se **hamesha same output**, aur koi **side effects** nahi (jaise API call, `console.log`, random values, ya bahar ki koi variable modify karna).

React internally **Strict Mode** me reducers ko **do baar call karta hai** (development me) — taaki tumhe pata chal jaye agar reducer me koi **impure behavior** hai. Agar reducer ke andar tumne API call ki, ya `Math.random()` use kiya, ya kisi bahar ke variable ko modify kiya, toh do baar chalne se **unexpected bugs** aa sakte hain. Isliye reducers **hamesha predictable aur side-effect-free** hone chahiye — saari "impure" cheezein (API calls, etc.) `useEffect` ya event handlers me honi chahiye, reducer ke andar nahi.

---

### Q3. `dispatch` exactly kya karta hai, aur "action object" ka structure kya hona chahiye? Ek complete example do.

`dispatch` ek function hai jo React tumhe deta hai — ise call karne ka matlab hai *"yeh action hua hai, reducer ise process kar."*

**Action object ka conventional structure:**

```jsx
{
  type: 'ADD_TODO',       // konsa action hua (REQUIRED)
  payload: 'Learn Hooks'  // extra data jo reducer ko chahiye (OPTIONAL, naam kuch bhi ho sakta hai)
}
```

**Complete Todo Example (industry-standard pattern):**

```jsx
import React, { useReducer } from 'react'

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.payload, completed: false }]
    case 'TOGGLE':
      return state.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t)
    case 'DELETE':
      return state.filter(t => t.id !== action.payload)
    default:
      return state
  }
}

const TodoApp = () => {
  const [todos, dispatch] = useReducer(todoReducer, [])

  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD', payload: 'New Task' })}>
        Add Todo
      </button>

      {todos.map(todo => (
        <div key={todo.id}>
          <span onClick={() => dispatch({ type: 'TOGGLE', payload: todo.id })}>
            {todo.text} {todo.completed ? '✅' : ''}
          </span>
          <button onClick={() => dispatch({ type: 'DELETE', payload: todo.id })}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
```

**Deep working — jab tum `dispatch({ type: 'ADD', payload: 'New Task' })` call karte ho:**

1. React internally `todoReducer(currentState, { type: 'ADD', payload: 'New Task' })` call karta hai
2. Reducer `switch` statement me `'ADD'` case match karta hai
3. **Naya array** return hota hai (`[...state, newTodo]` — spread se purana data copy, phir naya item add)
4. React is naye array ko **naya state** bana deta hai, aur component **re-render** hota hai

**Interview me bolne wali line:** *"Component sirf 'what happened' bolta hai via dispatch, 'how state changes' poori tarah reducer ke andar hai. Yeh separation of concerns hai — testing bhi easy hoti hai kyunki reducer ek pure function hai, tum use bina UI render kiye directly test kar sakte ho."*

---

### Q4. `useState` vs `useReducer` — kaunsa kab use karoge? Real scenario ke saath judge karo.

Yeh **decision-making** wala sawaal hai — interviewer dekhna chahta hai tumhe **judgment** hai ya sirf definitions rati hain.

**Decision framework:**

| Signal | Use |
|---|---|
| Ek independent value (counter, boolean toggle, text input) | `useState` |
| Multiple related sub-values jo ek saath change hote hain | `useReducer` |
| Next state, previous state pe **complex tarike se** depend karta hai | `useReducer` |
| Bahut saari alag-alag "actions" state ko modify kar sakti hain | `useReducer` |
| State update logic **components ke bahar bhi test karni ho** | `useReducer` (pure function hai) |

**Real scenario — Shopping Cart:**

```jsx
// ❌ useState se - messy ho jayega
const [items, setItems] = useState([])
const [totalPrice, setTotalPrice] = useState(0)
const [itemCount, setItemCount] = useState(0)

const addItem = (item) => {
  setItems([...items, item])
  setTotalPrice(totalPrice + item.price)   // manually sync karna pad raha hai
  setItemCount(itemCount + 1)              // yeh bhi manually
}
// har action (add, remove, updateQty) me teeno states ko manually sync karna padega
// agar kahi bhool gaye sync karna, bug guaranteed hai
```

```jsx
// ✅ useReducer se - centralized aur consistent
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItems = [...state.items, action.payload]
      return {
        items: newItems,
        totalPrice: newItems.reduce((sum, i) => sum + i.price, 0),
        itemCount: newItems.length
      }
    }
    default:
      return state
  }
}

const [cart, dispatch] = useReducer(cartReducer, { items: [], totalPrice: 0, itemCount: 0 })
```

**Kyun better hai:** Saari related values (`items`, `totalPrice`, `itemCount`) **ek hi jagah, ek hi function ke andar** consistently update hoti hain — sync todne ka koi risk nahi, kyunki sab ek hi `case` ke andar together calculate ho rahi hain.

---

### Q5. `useReducer` ko `useContext` ke saath combine karke "mini Redux" kaise banate hain? Yeh pattern kyu popular hai?

Yeh ek **bahut important real-world/industry pattern** hai — bade projects me isko **"Context + Reducer Pattern"** kehte hain, aur yeh **Redux jaisi state management** ka lightweight alternative hai (bina extra library install kiye).

**Problem jo yeh solve karta hai:** `useReducer` khud se sirf **ek component** ke andar state manage karta hai. Agar tumhe yeh state **poori app me kahi se bhi** access karni ho (jaise cart data — Navbar me item count dikhana ho, Product page se add karna ho, Checkout page me use karna ho), tumhe iske saath `useContext` combine karna padta hai.

```jsx
import React, { createContext, useContext, useReducer } from 'react'

// 1. Reducer function - state update logic
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    default:
      return state
  }
}

// 2. Context banaya
const CartContext = createContext()

// 3. Provider - useReducer aur Context ko combine kiya
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] })

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

// 4. Custom hook - clean access ke liye
export const useCart = () => useContext(CartContext)
```

**Kahi bhi app me use karo, bina prop drilling ke:**

```jsx
// Navbar.jsx
const { cart } = useCart()
return <span>Cart ({cart.items.length})</span>

// ProductPage.jsx
const { dispatch } = useCart()
return <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}>Add</button>
```

**Yeh pattern kyu popular hai — deep reasoning:**

1. **`useReducer`** state update logic ko **centralize aur predictable** banata hai (jaisa humne Q3-Q4 me dekha)
2. **`useContext`** us state ko **poori app me kahi se bhi accessible** banata hai, bina prop drilling ke
3. Dono combine karke — tumhe milta hai **Redux jaisa "global, predictable state management"**, **bina Redux install kiye**, **bina extra boilerplate ke** (actions creators, store config, middleware setup — kuch nahi chahiye)

**Interview me bolne wali powerful line:** *"Chhote-medium apps ke liye, Context + useReducer pattern Redux ka bahut acha lightweight alternative hai — same core idea (centralized reducer, dispatch actions) milta hai, but bina extra dependency ke. Bade apps me jaha state bahut complex ho, ya jaha middleware (logging, async actions) chahiye ho, tab Redux/Zustand jaisi dedicated libraries better fit hoti hain — but chhote-medium scale ke liye yeh combo kaafi hai."*

---

### Q1. What is `useReducer` and why does it exist when `useState` already exists?

Look, first understand — `useState` is perfect for **simple state**, like a counter or a boolean toggle. But as state gets **complex** — meaning there are **multiple related sub-values**, updates **depend on each other**, or there are many different **"actions"** that can modify the state — `useState` code gets **messy**. Lots of scattered `setX` calls, and update logic **spread across the component**.

`useReducer` solves exactly this problem. It's inspired by **Redux's "reducer pattern"** — all the state update logic lives in **one centralized function** (the reducer), and components just say **"what action happened"** (dispatch it), they don't concern themselves with **"how the state should change."**

```jsx
const [state, dispatch] = useReducer(reducerFunction, initialState)
```

**Mental model:** Think of `dispatch` as **"sending a request"** — *"this action happened."* The reducer function is a **"judge"** that looks at *"what should the new state be for this action"* and returns the new state. The component only knows **"what happened,"** not **"how it's handled."**

---

### Q2. What is the exact structure/contract of the reducer function? What should this function look like?

This is a very important technical detail — the reducer function follows **a specific shape**:

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}
```

**The contract is:**
1. **Takes two parameters:** `state` (current state) and `action` (the object that came from `dispatch()`)
2. **Always RETURNS a new state** — never mutates `state` directly
3. **`default` case is required** — if `action.type` doesn't match anything, **return the old state as-is**, otherwise React won't know what to do

**Curious question — why should a reducer be a "PURE FUNCTION"?**

**Pure function** means — the **same input always produces the same output**, and there are no **side effects** (like an API call, `console.log`, random values, or modifying an outside variable).

React internally calls reducers **twice in Strict Mode** (during development) — to help you catch **impure behavior**. If you made an API call inside your reducer, or used `Math.random()`, or modified an outside variable, calling it twice could cause **unexpected bugs**. That's why reducers should always be **predictable and side-effect-free** — all "impure" things (API calls, etc.) should live in `useEffect` or event handlers, not inside the reducer.

---

### Q3. What exactly does `dispatch` do, and what should the "action object" structure look like? Give a complete example.

`dispatch` is a function React gives you — calling it means *"this action happened, let the reducer process it."*

**Conventional action object structure:**

```jsx
{
  type: 'ADD_TODO',       // what action happened (REQUIRED)
  payload: 'Learn Hooks'  // extra data the reducer needs (OPTIONAL, can be named anything)
}
```

**Complete Todo Example (industry-standard pattern):**

```jsx
import React, { useReducer } from 'react'

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.payload, completed: false }]
    case 'TOGGLE':
      return state.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t)
    case 'DELETE':
      return state.filter(t => t.id !== action.payload)
    default:
      return state
  }
}

const TodoApp = () => {
  const [todos, dispatch] = useReducer(todoReducer, [])

  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD', payload: 'New Task' })}>
        Add Todo
      </button>

      {todos.map(todo => (
        <div key={todo.id}>
          <span onClick={() => dispatch({ type: 'TOGGLE', payload: todo.id })}>
            {todo.text} {todo.completed ? '✅' : ''}
          </span>
          <button onClick={() => dispatch({ type: 'DELETE', payload: todo.id })}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
```

**Deep working — when you call `dispatch({ type: 'ADD', payload: 'New Task' })`:**

1. React internally calls `todoReducer(currentState, { type: 'ADD', payload: 'New Task' })`
2. The reducer's `switch` statement matches the `'ADD'` case
3. A **new array** is returned (`[...state, newTodo]` — old data copied via spread, then the new item added)
4. React makes this new array the **new state**, and the component **re-renders**

**Line to say in interview:** *"The component only says 'what happened' via dispatch, and 'how state changes' lives entirely inside the reducer. This is separation of concerns — testing also becomes easier because the reducer is a pure function, you can test it directly without rendering UI."*

---

### Q4. `useState` vs `useReducer` — when do you use which? Judge with a real scenario.

This is a **decision-making** question — the interviewer wants to see if you have actual **judgment** or just memorized definitions.

**Decision framework:**

| Signal | Use |
|---|---|
| One independent value (counter, boolean toggle, text input) | `useState` |
| Multiple related sub-values that change together | `useReducer` |
| Next state depends on previous state in **complex ways** | `useReducer` |
| Many different "actions" can modify the state | `useReducer` |
| Need to test state update logic **outside components** | `useReducer` (it's a pure function) |

**Real scenario — Shopping Cart:**

```jsx
// ❌ With useState - gets messy
const [items, setItems] = useState([])
const [totalPrice, setTotalPrice] = useState(0)
const [itemCount, setItemCount] = useState(0)

const addItem = (item) => {
  setItems([...items, item])
  setTotalPrice(totalPrice + item.price)   // manual syncing needed
  setItemCount(itemCount + 1)              // this too, manually
}
// every action (add, remove, updateQty) needs all three states manually synced
// forget to sync somewhere, and a bug is guaranteed
```

```jsx
// ✅ With useReducer - centralized and consistent
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItems = [...state.items, action.payload]
      return {
        items: newItems,
        totalPrice: newItems.reduce((sum, i) => sum + i.price, 0),
        itemCount: newItems.length
      }
    }
    default:
      return state
  }
}

const [cart, dispatch] = useReducer(cartReducer, { items: [], totalPrice: 0, itemCount: 0 })
```

**Why this is better:** All related values (`items`, `totalPrice`, `itemCount`) update consistently **in one place, inside one function** — no risk of them going out of sync, since they're all calculated together within the same `case`.

---

### Q5. How do you combine `useReducer` with `useContext` to build a "mini Redux"? Why is this pattern popular?

This is a very important **real-world/industry pattern** — in large projects it's called the **"Context + Reducer Pattern,"** and it's a lightweight alternative to **Redux-style state management** (without installing an extra library).

**The problem this solves:** `useReducer` by itself only manages state **within one component**. If you need that state accessible **from anywhere in the app** (like cart data — showing item count in the Navbar, adding from the Product page, using it on the Checkout page), you need to combine it with `useContext`.

```jsx
import React, { createContext, useContext, useReducer } from 'react'

// 1. Reducer function - state update logic
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    default:
      return state
  }
}

// 2. Context created
const CartContext = createContext()

// 3. Provider - combined useReducer and Context
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] })

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

// 4. Custom hook - for clean access
export const useCart = () => useContext(CartContext)
```

**Use it anywhere in the app, without prop drilling:**

```jsx
// Navbar.jsx
const { cart } = useCart()
return <span>Cart ({cart.items.length})</span>

// ProductPage.jsx
const { dispatch } = useCart()
return <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}>Add</button>
```

**Why this pattern is popular — deep reasoning:**

1. **`useReducer`** makes the state update logic **centralized and predictable** (as we saw in Q3-Q4)
2. **`useContext`** makes that state **accessible from anywhere in the app**, without prop drilling
3. Combined together — you get **Redux-like "global, predictable state management"**, **without installing Redux**, **without the extra boilerplate** (action creators, store config, middleware setup — none of that needed)

**Powerful line to say in an interview:** *"For small-to-medium apps, the Context + useReducer pattern is a great lightweight alternative to Redux — you get the same core idea (centralized reducer, dispatch actions) without the extra dependency. In larger apps where state gets very complex, or where you need middleware (logging, async actions), dedicated libraries like Redux/Zustand become a better fit — but for small-to-medium scale, this combo is usually enough."*