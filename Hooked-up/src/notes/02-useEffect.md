Question 1: What is useEffect in React?
=> useEffect is a hook used in functional components to perform side effects after rendering, such as data fetching, subscriptions, or manual DOM manipulations.

Question 2: Why is dependency array used in useEffect ?

Question 3: Example of useEffect for data fetching ?

Question 4: How to perform cleanup in useEffect ? Explain with example.
=> you can return a cleanup function inside useEffect, which runs before the effect re-runs or when the component unmount.
This is useful for cleaning up subscriptions or event listeners.

Question 5: Explain useLayoutEffect and how it is different from useEffect ?


# useEffect Hook 

---

### Q1. `useEffect` kya hai aur yeh exist kyu karta hai?

Dekho, sabse pehle samjho — React component ka **primary kaam** hai JSX return karna, based on current state/props. Lekin real applications me humein aksar aisa kaam bhi karna padta hai jo **"rendering" ka part nahi hai** — jaise API call karna, timer chalana, event listener lagana, document title change karna, ya kisi external system (localStorage, third-party library) ke saath sync karna. Inhe **"Side Effects"** kehte hain.

`useEffect` React ko batata hai — *"component render hone ke BAAD yeh extra kaam bhi kar dena."* Yeh function components ko wo power deta hai jo class components me `componentDidMount`, `componentDidUpdate`, aur `componentWillUnmount` teeno milke dete the — but ek hi unified API ke through.

```jsx
useEffect(() => {
  // yeh code render ke BAAD chalega
}, [dependencies])
```

**Curious sawaal — "render ke baad" specifically kyu, render ke DAURAN kyu nahi?** Kyunki agar side effects render ke dauran chalte (jaise API call), toh React ka rendering process **blocked/slow** ho jata — screen pe kuch dikhne me time lagta. Isliye React pehle **DOM update karta hai** (user ko turant kuch dikhta hai), **uske baad** side effects chalata hai background me — isse **perceived performance** better hoti hai.

---

### Q2. `useEffect` ke andar exactly kya order me hota hai — render, DOM update, aur effect chalne ka sequence samjhao.

Yeh ek **bahut curious behind-the-scenes** sawaal hai jo depth test karta hai.

Poora cycle aise chalta hai:

```
1. Component function chalti hai (JSX return hota hai) — yeh "render phase" hai
2. React JSX ko actual DOM me convert karke screen pe commit karta hai — yeh "commit phase" hai
3. Browser paint karta hai (user ko screen pe dikhta hai)
4. TABHI React useEffect ke andar ka code chalata hai — asynchronously, paint ke baad
```

**Important insight:** `useEffect` **paint hone ke baad** chalta hai — matlab user ko pehle UI dikh jati hai, phir effect background me chalta hai. Isse UI **responsive** feel hoti hai, chahe effect ke andar heavy kaam ho raha ho.

**Bonus curious point:** `useLayoutEffect` (jo `useEffect` ka cousin hai) iske opposite kaam karta hai — yeh **paint hone se PEHLE**, synchronously chalta hai. Isko tab use karte hain jab tumhe DOM measurements chahiye ho (jaise element ki height/width) **paint se pehle** — warna user ko ek "flicker" dikh sakta hai (pehle purana layout, phir sahi layout).

---

### Q3. Dependency array ke teeno modes (`[]`, `[value]`, kuch nahi) me actual farak kya hai — behind the scenes React kaise decide karta hai kab effect chalana hai?

Yeh sabse zyada poocha jaane wala practical sawaal hai — chalo teeno cases deeply samjho.

```jsx
// Mode 1: No dependency array
useEffect(() => {
  console.log("Har render ke baad chalta hai")
})

// Mode 2: Empty dependency array
useEffect(() => {
  console.log("Sirf ek baar, mount hone pe chalta hai")
}, [])

// Mode 3: With dependencies
useEffect(() => {
  console.log("Jab bhi 'count' change ho, tab chalta hai")
}, [count])
```

**Andar kya ho raha hai:** React har effect ke saath uski **dependency array ko "yaad" rakhta hai** (previous render se). Jab bhi component re-render hota hai, React **naye dependency array ko purane se compare** karta hai — element by element, `Object.is()` (roughly `===`) use karke.

- **Mode 1 (no array):** React ko pata hi nahi ki kab chalana hai, isliye **safest assumption** leta hai — **har render** ke baad chala do.
- **Mode 2 (`[]`):** Array **khaali** hai, matlab "compare karne ke liye kuch hai hi nahi" — React isko **"kabhi change nahi hoga"** treat karta hai, isliye sirf **pehli baar** (mount) chalata hai.
- **Mode 3 (`[count]`):** React **`count` ki purani value ko naye se compare** karta hai. Agar same hai, effect **skip** hota hai. Agar different hai, effect **dobara** chalta hai.

**Curious extension — agar dependency array me object/array do, toh kya problem aati hai?**

```jsx
useEffect(() => {
  console.log("chal raha hai")
}, [{ name: 'Rahul' }])   // ❌ problem!
```

Yeh **har render pe chalega**, chahe values same dikhein! Kyunki `{ name: 'Rahul' } === { name: 'Rahul' }` JS me hamesha `false` hota hai — **naya object har render pe banta hai, naya reference hota hai.** React `Object.is()` se compare karta hai, jo **reference compare** karta hai, deep value compare nahi. Isliye objects/arrays ko dependency array me daalte time bahut dhyan rakhna padta hai — usually unko `useMemo` se stabilize karte hain, ya sirf unke primitive fields (jaise `name`) ko dependency me daalte hain.

---

### Q4. Cleanup function kya hoti hai, yeh kab chalti hai, aur isko na likhne se kya real-world problem hoti hai?

**Cleanup function** wo function hai jo tum `useEffect` ke andar se **return** karte ho:

```jsx
useEffect(() => {
  const timer = setInterval(() => console.log("tick"), 1000)

  return () => {
    clearInterval(timer)   // yeh cleanup function hai
  }
}, [])
```

**Yeh kab chalti hai — 2 scenarios:**

1. **Component unmount hone se pehle** — jab component screen se completely hat jata hai (jaise user navigate away kare)
2. **Effect dobara chalne se PEHLE** — agar dependency change hui aur effect **firse** chalne wala hai, toh React pehle **purana cleanup** chalata hai, phir **naya effect**

```
Render 1 → Effect chalta hai
   ↓ (dependency change hui)
Render 2 → PEHLE Render 1 ka CLEANUP chalta hai → PHIR naya Effect chalta hai
```

**Real-world problem agar cleanup na likho:**

Socho tumne ek event listener lagaya:

```jsx
useEffect(() => {
  window.addEventListener('resize', handleResize)
  // ❌ cleanup missing!
}, [])
```

Agar component unmount ho jaye (jaise user doosre page pe navigate kar jaye), yeh listener **memory me reh jayega** — kabhi remove nahi hoga. Yeh ek **memory leak** hai. Agar aisa multiple components me hoga baar-baar mount/unmount hone pe, memory usage **badhta hi jayega**, aur app slowly slow ho jayegi. Yeh production apps me **bahut common aur serious bug** hai.

**Doosra real scenario — API race condition:**

```jsx
useEffect(() => {
  let cancelled = false

  fetch(`/api/user/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!cancelled) setUser(data)   // sirf tab set karo agar cancel nahi hua
    })

  return () => {
    cancelled = true   // agar userId change ho gaya beech me, purani request ignore karo
  }
}, [userId])
```

Agar `userId` bahut fast change ho (jaise dropdown me user jaldi-jaldi switch kare), **purani API calls** abhi bhi **pending** ho sakti hain jab naya effect chal chuka ho. Bina cleanup ke, **purani response** bhi apply ho sakti hai state pe **naye request ke baad**, jisse UI me **galat data** dikhega (isko "race condition" kehte hain). Cleanup function isko rokta hai.

---

### Q5. `useEffect` ke andar directly `async` function kyu nahi likh sakte? Sahi tareeka kya hai?

Yeh ek **common beginner mistake** hai jo bahut jaldi pakड़ा jata hai interview me.

```jsx
// ❌ GALAT
useEffect(async () => {
  const res = await fetch('/api/data')
  const data = await res.json()
  setData(data)
}, [])
```

**Kyun galat hai:** `useEffect` **expect** karta hai ki uska callback function ya toh **kuch return na kare**, ya phir **ek cleanup function return kare**. Lekin `async` function **hamesha ek Promise return karta hai** (chahe tum explicitly kuch return na karo). React jab is Promise ko dekhta hai, confuse ho jata hai — usse laga tha shayad yeh cleanup function hai, but yeh toh Promise hai — **React error/warning throw karta hai**, aur cleanup logic bhi sahi se kaam nahi karta.

**Sahi tareeka — andar ek alag async function banao aur usko call karo:**

```jsx
// ✅ SAHI
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch('/api/data')
    const data = await res.json()
    setData(data)
  }

  fetchData()   // async function ko andar se call kiya
}, [])
```

Yaha `useEffect` ka callback khud **synchronous** hai (kuch return nahi kar raha), lekin uske **andar** ek async function define karke turant call kar diya. Isse React ko koi confusion nahi hoti, aur cleanup bhi properly kaam kar sakta hai agar zarurat pade.

---

### Q6. `useEffect` ke real-world use cases kya-kya hain jo tum industry me daily use karte ho?

Yeh sawaal interviewer **practical exposure** check karne ke liye poochta hai — chalo har use case ko chhote example ke saath dekhte hain.

**1. Data Fetching (sabse common):**

```jsx
useEffect(() => {
  const fetchUser = async () => {
    const res = await fetch(`/api/users/${userId}`)
    setUser(await res.json())
  }
  fetchUser()
}, [userId])
```

**2. Event Listeners (window resize, scroll, keyboard):**

```jsx
useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

**3. Timers / Intervals:**

```jsx
useEffect(() => {
  const interval = setInterval(() => setSeconds(s => s + 1), 1000)
  return () => clearInterval(interval)
}, [])
```

**4. Document Title Update:**

```jsx
useEffect(() => {
  document.title = `${unreadCount} New Messages`
}, [unreadCount])
```

**5. Syncing with localStorage:**

```jsx
useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])
```

**6. Subscriptions (WebSocket, real-time data):**

```jsx
useEffect(() => {
  const socket = new WebSocket('wss://example.com')
  socket.onmessage = (event) => setMessages(prev => [...prev, event.data])
  return () => socket.close()
}, [])
```

**Common pattern jo har use case me dikhega:** *"Setup karo effect ke andar, aur agar setup ne kuch persistent create kiya hai (listener, timer, connection), toh uska cleanup zaroor likho."*

---

### Q7. Ek scenario do jaha `useEffect` ka **galat use** performance issue create kar sakta hai, aur uska fix kya hoga.

Yeh **senior-level judgment** wala sawaal hai.

**Scenario — Infinite Loop Bug:**

```jsx
// ❌ INFINITE LOOP
useEffect(() => {
  setData([...data, newItem])   // yeh 'data' ko update karta hai
}, [data])   // 'data' hi dependency hai!
```

**Kya ho raha hai:** Effect `data` ko update karta hai → `data` change hone se effect **dobara chalta hai** (kyunki `data` dependency array me hai) → jo phir se `data` ko update karta hai → aur yeh cycle **kabhi khatam nahi hota**. Yeh app ko **crash** kar sakta hai ya browser ko **freeze**.

**Fix:** Ya toh dependency ko sahi rakho (jo actually trigger karni chahiye thi update ko, `data` khud nahi), ya functional update use karo agar `data` pe based update karna hai but usko dependency banane ki zarurat nahi:

```jsx
// ✅ FIXED - agar yeh sirf ek baar chalna chahiye
useEffect(() => {
  setData(prev => [...prev, newItem])
}, [newItem])   // sirf newItem par depend karta hai, data par nahi
```

**Ek aur common performance issue — unnecessary re-fetching:**

```jsx
// ❌ Naya object har render pe, useEffect har baar chalega
const options = { method: 'GET' }
useEffect(() => {
  fetch('/api/data', options)
}, [options])   // options ka reference har render pe naya hai!
```

Yaha bhi wahi "object/array dependency" problem hai jo humne Q3 me dekhi — `options` har render pe **naya object** hai, isliye effect **har render pe chalega**, chahe actual values same hon. Fix — `options` ko effect ke **andar hi define karo** (agar bahar use nahi ho raha), ya `useMemo` se stabilize karo.

**Interview me bolne wali line:** *"`useEffect` ke performance bugs zyadatar dependency array ki galat understanding se aate hain — ya toh state ko apni hi dependency banana (infinite loop), ya objects/arrays ko bina memoize kiye dependency banana (unnecessary re-runs). Dono cases me solution hai — dependency array ko carefully socho: 'yeh effect KAB dobara chalna chahiye,' na ki bas jo bhi variables andar use ho rahe hain unhe blindly daal do."*

---

## English Version

### Q1. What is `useEffect` and why does it exist?

Look, first understand this — a React component's **primary job** is to return JSX based on current state/props. But in real applications, we often need to do things that **aren't part of "rendering"** — like making API calls, running timers, attaching event listeners, updating the document title, or syncing with an external system (localStorage, a third-party library). These are called **"Side Effects."**

`useEffect` tells React — *"after the component renders, also do this extra work."* It gives function components the power that class components used to get from `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined — but through one unified API.

```jsx
useEffect(() => {
  // this code runs AFTER render
}, [dependencies])
```

**Curious question — why specifically "after render," not "during render"?** Because if side effects ran during rendering (like an API call), React's rendering process would get **blocked/slow** — it would take longer for anything to appear on screen. So React first **commits the DOM update** (the user sees something immediately), and **only then** runs side effects in the background — this gives better **perceived performance**.

---

### Q2. Walk through the exact order behind the scenes — render, DOM commit, and when the effect actually runs.

This is a very **curious behind-the-scenes** question that tests depth.

Here's the full cycle:

```
1. The component function runs (JSX gets returned) — this is the "render phase"
2. React converts the JSX into actual DOM and commits it to the screen — "commit phase"
3. The browser paints (user sees it on screen)
4. ONLY THEN does React run the code inside useEffect — asynchronously, after paint
```

**Key insight:** `useEffect` runs **after paint** — meaning the user sees the UI first, and then the effect runs in the background. This makes the UI feel **responsive**, even if the effect does something heavy.

**Bonus curious point:** `useLayoutEffect` (a cousin of `useEffect`) does the opposite — it runs **before paint**, synchronously. This is used when you need DOM measurements (like an element's height/width) **before** the paint happens — otherwise the user might see a "flicker" (old layout first, then the correct layout).

---

### Q3. What's the actual difference between the three dependency array modes (`[]`, `[value]`, none) — how does React decide behind the scenes when to run the effect?

This is the most commonly asked practical question — let's understand all three deeply.

```jsx
// Mode 1: No dependency array
useEffect(() => {
  console.log("Runs after every render")
})

// Mode 2: Empty dependency array
useEffect(() => {
  console.log("Runs only once, on mount")
}, [])

// Mode 3: With dependencies
useEffect(() => {
  console.log("Runs whenever 'count' changes")
}, [count])
```

**What's happening internally:** React "remembers" the dependency array for each effect from the previous render. Whenever the component re-renders, React **compares the new dependency array to the old one** — element by element, using `Object.is()` (roughly `===`).

- **Mode 1 (no array):** React has no way to know when to run it, so it takes the **safest assumption** — run it after **every** render.
- **Mode 2 (`[]`):** The array is **empty**, meaning "there's nothing to compare" — React treats this as **"never changes,"** so it only runs on **mount**.
- **Mode 3 (`[count]`):** React **compares the old `count` value to the new one**. If they're the same, the effect is **skipped**. If different, the effect **runs again**.

**Curious extension — what if you put an object/array in the dependency array?**

```jsx
useEffect(() => {
  console.log("running")
}, [{ name: 'Rahul' }])   // ❌ problem!
```

This will run **on every render**, even if the values look the same! Because `{ name: 'Rahul' } === { name: 'Rahul' }` is always `false` in JS — **a new object gets created on every render, a new reference.** React compares using `Object.is()`, which does a **reference comparison**, not a deep value comparison. So you need to be careful with objects/arrays in the dependency array — usually stabilizing them with `useMemo`, or only including their primitive fields (like `name`) in the dependency.

---

### Q4. What is the cleanup function, when does it run, and what real-world problem occurs if you don't write it?

The **cleanup function** is the function you **return** from inside `useEffect`:

```jsx
useEffect(() => {
  const timer = setInterval(() => console.log("tick"), 1000)

  return () => {
    clearInterval(timer)   // this is the cleanup function
  }
}, [])
```

**It runs in 2 scenarios:**

1. **Before the component unmounts** — when the component fully disappears from the screen (like when the user navigates away)
2. **Before the effect runs again** — if a dependency changed and the effect is about to run **again**, React first runs the **previous cleanup**, then the **new effect**

```
Render 1 → Effect runs
   ↓ (dependency changed)
Render 2 → FIRST Render 1's CLEANUP runs → THEN the new Effect runs
```

**Real-world problem if you skip cleanup:**

Say you added an event listener:

```jsx
useEffect(() => {
  window.addEventListener('resize', handleResize)
  // ❌ cleanup missing!
}, [])
```

If the component unmounts (like the user navigating to another page), this listener **stays in memory** — it never gets removed. This is a **memory leak**. If this happens repeatedly across multiple components mounting/unmounting, memory usage **keeps growing**, and the app slowly becomes sluggish. This is a **very common and serious bug** in production apps.

**Another real scenario — API race condition:**

```jsx
useEffect(() => {
  let cancelled = false

  fetch(`/api/user/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!cancelled) setUser(data)   // only set if not cancelled
    })

  return () => {
    cancelled = true   // if userId changed mid-flight, ignore the old request
  }
}, [userId])
```

If `userId` changes very fast (like a dropdown being switched quickly), **old API calls** might still be **pending** by the time the new effect has already run. Without cleanup, the **old response** could apply to state **after** the new request, showing **wrong data** in the UI (this is called a "race condition"). The cleanup function prevents this.

---

### Q5. Why can't you write an `async` function directly inside `useEffect`? What's the correct way?

This is a **common beginner mistake** that's caught quickly in interviews.

```jsx
// ❌ WRONG
useEffect(async () => {
  const res = await fetch('/api/data')
  const data = await res.json()
  setData(data)
}, [])
```

**Why it's wrong:** `useEffect` **expects** its callback function to either **return nothing**, or **return a cleanup function**. But an `async` function **always returns a Promise** (even if you don't explicitly return anything). When React sees this Promise, it gets confused — it expected a possible cleanup function, but got a Promise instead — **React throws an error/warning**, and cleanup logic doesn't work correctly either.

**Correct way — define a separate async function inside and call it:**

```jsx
// ✅ CORRECT
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch('/api/data')
    const data = await res.json()
    setData(data)
  }

  fetchData()   // called the async function from inside
}, [])
```

Here, `useEffect`'s own callback is **synchronous** (returns nothing), but **inside** it, we defined an async function and called it immediately. This avoids any confusion for React, and cleanup can also work properly when needed.

---

### Q6. What are the real-world use cases of `useEffect` that you use daily in the industry?

Interviewers ask this to check **practical exposure** — let's look at each use case with a small example.

**1. Data Fetching (most common):**

```jsx
useEffect(() => {
  const fetchUser = async () => {
    const res = await fetch(`/api/users/${userId}`)
    setUser(await res.json())
  }
  fetchUser()
}, [userId])
```

**2. Event Listeners (window resize, scroll, keyboard):**

```jsx
useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

**3. Timers / Intervals:**

```jsx
useEffect(() => {
  const interval = setInterval(() => setSeconds(s => s + 1), 1000)
  return () => clearInterval(interval)
}, [])
```

**4. Document Title Update:**

```jsx
useEffect(() => {
  document.title = `${unreadCount} New Messages`
}, [unreadCount])
```

**5. Syncing with localStorage:**

```jsx
useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])
```

**6. Subscriptions (WebSocket, real-time data):**

```jsx
useEffect(() => {
  const socket = new WebSocket('wss://example.com')
  socket.onmessage = (event) => setMessages(prev => [...prev, event.data])
  return () => socket.close()
}, [])
```

**Common pattern you'll see in every use case:** *"Set something up inside the effect, and if that setup created something persistent (a listener, timer, connection), always write its cleanup."*

---

### Q7. Give a scenario where misusing `useEffect` can cause a performance issue, and what the fix would be.

This is a **senior-level judgment** question.

**Scenario — Infinite Loop Bug:**

```jsx
// ❌ INFINITE LOOP
useEffect(() => {
  setData([...data, newItem])   // this updates 'data'
}, [data])   // 'data' is the dependency!
```

**What's happening:** The effect updates `data` → `data` changing causes the effect to **run again** (since `data` is in the dependency array) → which updates `data` again → and this cycle **never ends**. This can **crash** the app or **freeze** the browser.

**Fix:** Either correct the dependency (to whatever should actually trigger the update, not `data` itself), or use a functional update if you're basing the update on `data` but don't need to make it a dependency:

```jsx
// ✅ FIXED - if this should only run once per new item
useEffect(() => {
  setData(prev => [...prev, newItem])
}, [newItem])   // depends only on newItem, not data
```

**Another common performance issue — unnecessary re-fetching:**

```jsx
// ❌ New object on every render, useEffect runs every time
const options = { method: 'GET' }
useEffect(() => {
  fetch('/api/data', options)
}, [options])   // options's reference is new on every render!
```

Here too, it's the same "object/array dependency" problem we saw in Q3 — `options` is a **new object** on every render, so the effect **runs on every render**, even though the actual values are the same. Fix — define `options` **inside the effect itself** (if it's not used outside), or stabilize it with `useMemo`.

**Line to say in interview:** *"Most `useEffect` performance bugs come from misunderstanding the dependency array — either making state its own dependency (infinite loop), or making objects/arrays a dependency without memoizing them (unnecessary re-runs). The fix in both cases is to carefully think about the dependency array as: 'when should this effect actually re-run,' rather than just blindly listing every variable used inside it."*