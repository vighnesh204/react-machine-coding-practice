Question 1: What is a useRef hook ?
=> useRef is a hook used to create a mutable reference that persists across renders
=> It returns a mutable object with a .current property

Question 2: When would you use useRef ?
=> Accessing DOM elements or managing focus.
=> Storing mutable values that persists without causing re-renders
=> Caching values to avoid re-initialization on re-renders.

Question 3: How do you access DOM elements using useRef ?

Question 4: Difference between useState and useRef ?

# useRef Hook
---

### Q1. `useRef` kya hai aur yeh `useState` se fundamentally kaise alag hai?

Dekho, sabse pehle ek cheez clear karo — `useRef` bhi ek **"value ko renders ke beech persist"** karne ka tareeka hai, bilkul `useState` jaisa. Lekin dono me **ek fundamental difference** hai jo interview me hamesha pucha jata hai:

> **`useState` change hone pe RE-RENDER trigger karta hai. `useRef` change hone pe RE-RENDER TRIGGER NAHI karta.**

```jsx
const [count, setCount] = useState(0)   // change → re-render hoga
const countRef = useRef(0)              // change → re-render NAHI hoga
```

`useRef` ek object return karta hai jisme sirf **ek property** hoti hai — `.current`. Tum `.current` ko **kabhi bhi, kahi se bhi** update kar sakte ho, bina kisi setter function ke, aur React ko **pata hi nahi chalega** ki kuch change hua — UI update nahi hogi.

**Curious sawaal — agar re-render nahi karta, toh yeh useful kab hai?** Jab tumhe **"silent memory"** chahiye ho — aisi value jo tumhe yaad rakhni hai across renders, lekin uska UI se koi lena-dena nahi hai. Jaise — previous value store karna, timer ID save karna, ya DOM element ka direct reference rakhna.

---

### Q2. `useRef` se DOM element ko directly access kaise karte hain, aur andar yeh kaam kaise karta hai?

Sabse common use case — DOM manipulation (focus karna, scroll karna, measurements lena) bina `document.getElementById` jaise **imperative DOM APIs** ka use kiye.

```jsx
import React, { useRef } from 'react'

const SearchInput = () => {
  const inputRef = useRef(null)   // initially null

  const focusInput = () => {
    inputRef.current.focus()   // yaha 'current' actual DOM node hai
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  )
}
```

**Behind the scenes kya ho raha hai:**

1. `useRef(null)` call hote hi React ek object banata hai: `{ current: null }`
2. `<input ref={inputRef}>` likhne se React ko pata chal jata hai — *"jab yeh DOM element create ho jaye, uska reference `inputRef.current` me daal dena."*
3. Jab component **mount** hota hai aur React **actual DOM node** create karta hai, React automatically `inputRef.current = <actual DOM element>` set kar deta hai — **yeh commit phase ke dauran hota hai**, render se pehle nahi (kyunki render phase me DOM abhi exist hi nahi karta).
4. Ab tumhare paas **direct access** hai us DOM node tak — `.focus()`, `.scrollIntoView()`, `.getBoundingClientRect()` jaise native browser methods use kar sakte ho.

**Interview me bolne wali line:** *"`ref` attribute React ko DOM node ka reference `.current` me populate karne ka instruction deta hai — yeh React ke declarative model se ek 'escape hatch' hai jab humein imperative DOM access chahiye ho."*

---

### Q3. Ek aisa real example do jaha `useState` use karne se **infinite loop** ban jata, aur `useRef` se woh problem solve ho jati hai.

Yeh question **deep understanding** test karta hai ki tumhe pata hai `useRef` **kab genuinely zaroori** hota hai, sirf "convenience" ke liye nahi.

**Scenario — Render Count Tracker:**

```jsx
import React, { useState, useRef, useEffect } from 'react'

const RenderCounter = () => {
  const [text, setText] = useState('')
  const renderCount = useRef(0)   // ✅ useRef use kiya

  useEffect(() => {
    renderCount.current = renderCount.current + 1
  })

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>Component re-rendered: {renderCount.current} times</p>
    </div>
  )
}
```

**Agar `useState` use karte, toh kya hota:**

```jsx
// ❌ INFINITE LOOP scenario
const [renderCount, setRenderCount] = useState(0)

useEffect(() => {
  setRenderCount(renderCount + 1)   // yeh state update karta hai
})   // dependency array hi nahi diya, har render pe chalega
```

**Kya hota — step by step:**
1. Component render hota hai
2. `useEffect` chalta hai (no dependency array, har render ke baad chalega) → `setRenderCount` call hota hai
3. State change hone se **naya re-render** trigger hota hai
4. Naya render hone se `useEffect` **phir se** chalta hai → `setRenderCount` **phir se** call hota hai
5. Yeh cycle **kabhi khatam nahi hota** — infinite loop, browser freeze ho sakta hai

**`useRef` se yeh problem solve kaise hoti hai:** `renderCount.current` ko update karna **re-render trigger nahi karta**. Isliye `useEffect` chalta hai, `.current` update hota hai, **but koi naya render trigger nahi hota** us wajah se — cycle rukta hai. Render count sirf tab badhega jab **kisi aur reason se** (jaise `text` state change hone se) component naturally re-render ho.

**Golden rule:** *"Agar tumhe kisi value ko track karna hai jiska UI pe koi seedha impact nahi hai, use `useRef`. Agar value UI me dikhni hai ya UI ko affect karti hai, use `useState`."*

---

### Q4. `useRef` se "previous value" (pichli render ki value) kaise store karte hain? Isse related ek common custom hook pattern batao.

Yeh ek **bahut practical aur industry-common pattern** hai — `usePrevious` custom hook, jo bahut projects me milta hai.

```jsx
import React, { useState, useEffect, useRef } from 'react'

// Custom hook - previous value track karne ke liye
const usePrevious = (value) => {
  const ref = useRef()

  useEffect(() => {
    ref.current = value   // HAR render ke BAAD, current value ko store kar do
  })

  return ref.current   // yeh render ke DAURAN, PURANI value return karega
}

const Counter = () => {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  return (
    <div>
      <p>Current: {count}, Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

**Deep working samjho — yeh timing wala trick hai:**

Jab component **render** hota hai, `usePrevious(count)` call hota hai. Us time pe `ref.current` me **abhi bhi purani value** hai — kyunki `useEffect` (jo `ref.current` ko update karta hai) **render ke baad** chalta hai, render ke **dauran nahi**.

```
Render 1 (count = 0):
  - usePrevious return karta hai ref.current (jo abhi undefined hai)
  - RENDER KE BAAD: useEffect chalta hai → ref.current = 0

User clicks, count = 1
Render 2 (count = 1):
  - usePrevious return karta hai ref.current (jo abhi 0 hai — Render 1 ka set kiya hua!)
  - "Current: 1, Previous: 0" dikhta hai ✅
  - RENDER KE BAAD: useEffect chalta hai → ref.current = 1
```

Yeh **exact timing gap** — jo `useEffect` render ke baad chalne ki wajah se hai — hi is pattern ko possible banata hai. Yeh ek bahut elegant example hai ki **`useRef` aur `useEffect` ka timing kaise milke kaam karta hai.**

---

### Q5. `useRef` ka use kar ke tum `setInterval`/`setTimeout` ka ID kyu store karte ho, seedha variable me kyu nahi?

Yeh sawaal **closures aur component lifecycle** ki samajh test karta hai.

```jsx
import React, { useState, useRef } from 'react'

const Timer = () => {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef(null)

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(intervalRef.current)   // stored ID use karke clear kiya
  }

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  )
}
```

**Agar normal variable use karte, kya problem hoti:**

```jsx
// ❌ PROBLEM
let intervalId = null   // normal variable

const startTimer = () => {
  intervalId = setInterval(() => { ... }, 1000)
}

const stopTimer = () => {
  clearInterval(intervalId)   // yeh kaam nahi karega sahi se!
}
```

**Kyun fail hota hai:** Har baar jab component **re-render** hota hai (function phir se chalta hai), `intervalId` jaisa **normal variable reset ho jata hai** apni initial value pe (`null`) — kyunki React function ko **poora phir se execute** karta hai har render pe, aur normal variables us function scope ke andar hi bante-mitte rehte hain.

`useRef` se banaya gaya `.current` **iske opposite** — yeh **renders ke beech persist** karta hai, kabhi reset nahi hota (jab tak tum khud reset na karo). Isliye jab `stopTimer` baad me kabhi bhi call ho, `intervalRef.current` me **wahi original interval ID** milega jo `startTimer` ne set kiya tha — chahe beech me kitni bhi re-renders ho chuki hon.

**Interview me bolne wali line:** *"Timer IDs, subscription references, ya koi bhi 'mutable value jo re-renders ke beech survive karni chahiye but UI ko trigger nahi karni chahiye' — inke liye `useRef` sahi choice hai, normal variables re-render pe reset ho jate hain isliye unpe bharosa nahi kar sakte."*

---

## English Version

### Q1. What is `useRef` and how is it fundamentally different from `useState`?

Look, first clarify one thing — `useRef` is also a way to **"persist a value across renders,"** just like `useState`. But there's **one fundamental difference** that's always asked in interviews:

> **Changing `useState` triggers a RE-RENDER. Changing `useRef` does NOT trigger a re-render.**

```jsx
const [count, setCount] = useState(0)   // change → will re-render
const countRef = useRef(0)              // change → will NOT re-render
```

`useRef` returns an object that has just **one property** — `.current`. You can update `.current` **anytime, from anywhere**, without any setter function, and React **has no idea** anything changed — the UI won't update.

**Curious question — if it doesn't re-render, when is it useful?** When you need **"silent memory"** — a value you need to remember across renders, but that has nothing to do with the UI. Like — storing a previous value, saving a timer ID, or keeping a direct reference to a DOM element.

---

### Q2. How do you directly access a DOM element using `useRef`, and how does it work internally?

The most common use case — DOM manipulation (focusing, scrolling, getting measurements) without using imperative DOM APIs like `document.getElementById`.

```jsx
import React, { useRef } from 'react'

const SearchInput = () => {
  const inputRef = useRef(null)   // initially null

  const focusInput = () => {
    inputRef.current.focus()   // here 'current' is the actual DOM node
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  )
}
```

**What's happening behind the scenes:**

1. Calling `useRef(null)` creates an object: `{ current: null }`
2. Writing `<input ref={inputRef}>` tells React — *"once this DOM element is created, put its reference into `inputRef.current`."*
3. When the component **mounts** and React creates the **actual DOM node**, React automatically sets `inputRef.current = <actual DOM element>` — **this happens during the commit phase**, not before (since the DOM doesn't exist yet during the render phase).
4. Now you have **direct access** to that DOM node — you can use native browser methods like `.focus()`, `.scrollIntoView()`, `.getBoundingClientRect()`.

**Line to say in interview:** *"The `ref` attribute instructs React to populate the DOM node's reference into `.current` — it's an 'escape hatch' from React's declarative model whenever we need imperative DOM access."*

---

### Q3. Give a real example where using `useState` would cause an **infinite loop**, and `useRef` solves that problem.

This question tests **deep understanding** of when `useRef` is genuinely necessary, not just for "convenience."

**Scenario — Render Count Tracker:**

```jsx
import React, { useState, useRef, useEffect } from 'react'

const RenderCounter = () => {
  const [text, setText] = useState('')
  const renderCount = useRef(0)   // ✅ using useRef

  useEffect(() => {
    renderCount.current = renderCount.current + 1
  })

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>Component re-rendered: {renderCount.current} times</p>
    </div>
  )
}
```

**What would happen if you used `useState` instead:**

```jsx
// ❌ INFINITE LOOP scenario
const [renderCount, setRenderCount] = useState(0)

useEffect(() => {
  setRenderCount(renderCount + 1)   // this updates state
})   // no dependency array, runs after every render
```

**What happens — step by step:**
1. Component renders
2. `useEffect` runs (no dependency array, so it runs after every render) → `setRenderCount` gets called
3. The state change triggers a **new re-render**
4. The new render causes `useEffect` to run **again** → `setRenderCount` gets called **again**
5. This cycle **never ends** — infinite loop, the browser might freeze

**How `useRef` solves this:** Updating `renderCount.current` **doesn't trigger a re-render**. So `useEffect` runs, `.current` updates, **but no new render is triggered** because of it — the cycle stops. The render count will only increase when the component naturally re-renders **for some other reason** (like the `text` state changing).

**Golden rule:** *"If you need to track a value that has no direct impact on the UI, use `useRef`. If the value needs to be shown in the UI or affects the UI, use `useState`."*

---

### Q4. How do you store the "previous value" (from the last render) using `useRef`? Describe a common custom hook pattern related to this.

This is a very **practical and industry-common pattern** — the `usePrevious` custom hook, found in a lot of projects.

```jsx
import React, { useState, useEffect, useRef } from 'react'

// Custom hook - to track the previous value
const usePrevious = (value) => {
  const ref = useRef()

  useEffect(() => {
    ref.current = value   // AFTER every render, store the current value
  })

  return ref.current   // during render, this returns the OLD value
}

const Counter = () => {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  return (
    <div>
      <p>Current: {count}, Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

**Deep working — this is a timing trick:**

When the component **renders**, `usePrevious(count)` gets called. At that time, `ref.current` **still holds the old value** — because `useEffect` (which updates `ref.current`) runs **after render**, not **during** it.

```
Render 1 (count = 0):
  - usePrevious returns ref.current (currently undefined)
  - AFTER RENDER: useEffect runs → ref.current = 0

User clicks, count = 1
Render 2 (count = 1):
  - usePrevious returns ref.current (currently 0 — set by Render 1!)
  - Shows "Current: 1, Previous: 0" ✅
  - AFTER RENDER: useEffect runs → ref.current = 1
```

This **exact timing gap** — caused by `useEffect` running after render — is what makes this pattern possible. It's a very elegant example of how **`useRef` and `useEffect`'s timing work together.**

---

### Q5. Why do you store a `setInterval`/`setTimeout` ID using `useRef`, instead of a plain variable?

This question tests understanding of **closures and component lifecycle**.

```jsx
import React, { useState, useRef } from 'react'

const Timer = () => {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef(null)

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(intervalRef.current)   // cleared using the stored ID
  }

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  )
}
```

**What would go wrong with a plain variable:**

```jsx
// ❌ PROBLEM
let intervalId = null   // plain variable

const startTimer = () => {
  intervalId = setInterval(() => { ... }, 1000)
}

const stopTimer = () => {
  clearInterval(intervalId)   // this won't work correctly!
}
```

**Why it fails:** Every time the component **re-renders** (the function runs again), a plain variable like `intervalId` **gets reset** to its initial value (`null`) — because React **re-executes the entire function** on every render, and plain variables are created and destroyed within that function's scope each time.

The `.current` created via `useRef` is **the opposite** — it **persists across renders**, never resetting (unless you reset it yourself). So whenever `stopTimer` gets called later, `intervalRef.current` will still hold **the same original interval ID** that `startTimer` set — no matter how many re-renders happened in between.

**Line to say in interview:** *"For timer IDs, subscription references, or any 'mutable value that needs to survive across renders but shouldn't trigger the UI' — `useRef` is the right choice, because plain variables reset on every render and can't be relied upon."*