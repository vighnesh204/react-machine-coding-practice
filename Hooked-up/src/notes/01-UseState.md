# useState Hook 

---

### Q1. `useState` kya hai aur kab use karte hain?

Dekho, sabse pehle samjho — React ka kaam hai UI ko data ke saath sync rakhna. Ab agar tum normal JS variable use karo, React ko pata hi nahi chalega ki value change hui hai, kyunki React kisi bhi variable ko "watch" nahi karta by default.

`useState` yahi gap fill karta hai — yeh React ko ek signal deta hai: *"is value pe nazar rakho, jab bhi yeh badle, UI ko re-render kar dena."* Technically yeh ek array return karta hai — pehla element current snapshot hai, doosra ek setter function hai jo naya render trigger karta hai.

Hum ise use karte hain jab bhi UI ka koi part user interaction se ya time ke saath change hona ho — form input, toggle, counter, jo bhi "dynamic" ho screen pe.

---

### Q2. `setCount(count + 1)` do baar call karne se count sirf 1 hi kyu badhta hai, 2 kyu nahi?

Yeh ek bahut interesting gotcha hai — aur yahi cheez batati hai ki tumhe closures ka concept aata hai ya nahi.

Socho aisa — jab function chalta hai, `count` uss particular render ka ek "frozen snapshot" hai — jaise ek photo click ho gayi ho us moment ki. Dono `setCount(count + 1)` calls usi ek photo ko dekh rahe hain, dono ko `count` ki wahi purani value dikh rahi hai. Isliye dono "0 + 1 karo" bol rahe hain, result sirf `1` aata hai — `2` nahi.

Fix karne ke liye hum functional update use karte hain:

```js
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

Yaha hum React se keh rahe hain — *"jo bhi latest value ho queue me, usi pe apply kar dena."* React inhe sequentially process karta hai, isliye dusri call pehli wali ka result use karti hai — sahi `2` milta hai.

**Rule of thumb:** Jab bhi naya state, purane state pe depend karta ho, functional update use karo. Blindly kabhi bhi `count` ko direct reference karke update mat karo agar wo previous value pe based ho.

---

### Q3. State update synchronous hai ya asynchronous?

Yeh sawaal thoda tricky hai kyunki technically answer "synchronous" hai, lekin behavior asynchronous jaisa lagta hai — confusion yahi se aata hai.

Andar kya hota hai — React 18 me automatic batching hai. Matlab agar ek event handler ke andar tum multiple `setState` calls karo, React unhe ek saath collect kar leta hai aur ek hi re-render me apply karta hai — bar-bar re-render nahi karta har `setState` ke liye. Yeh purely performance ke liye hai — soch ke dekho, agar har `setState` alag re-render trigger kare, toh ek function me 5 `setState` calls ka matlab 5 re-renders — bahut wasteful hoga.

Isi wajah se — `setState` ke turant baad agar tum `console.log(state)` karo, tumhe purani value hi dikhegi, kyunki update abhi queue me hai, apply nahi hua. Yehi cheez bahut logon ko confuse karti hai — woh sochte hain "state update async hai," jabki actually batching ki wajah se aisa dikhta hai.

---

### Q4. Object state update karte time sirf ek field change karne pe baaki fields gayab kyu ho jaate hain?

Yeh question directly class components ke `this.setState` aur `useState` ke difference ko test karta hai — bahut common interview trap hai.

Dekho, `this.setState` (class components me) automatically merge karta tha — tum sirf ek field do, baaki apne aap preserve ho jate the. Lekin `useState` ka setter bilkul alag philosophy follow karta hai — yeh sirf **REPLACE** karta hai, merge nahi.

```js
setUser({ name: 'Rahul' })   // poora object REPLACE ho gaya, age gayab!
```

**Curious sawaal — React ne aisa kyu kiya, merge kyu nahi?** Kyunki `useState` generic hai — sirf objects ke liye nahi bana, numbers, strings, booleans sabke liye kaam karta hai. Agar React automatically merge karne ki koshish karta, toh yeh sirf objects ke liye hi sense banata — number ya boolean ko "merge" karne ka koi concept hi nahi hai. Isliye simplicity aur consistency ke liye, React ne replace behavior rakha, merging developer ki responsibility bana di.

**Fix:**

```js
setUser(prev => ({ ...prev, name: 'Rahul' }))
```

Spread operator purana data copy karta hai, phir specified field overwrite karta hai.

---

### Q5. Lazy initialization kya hai aur kab use karni chahiye?

Yeh ek aisa concept hai jo bahut kam log jaante hain, aur jab tum bolte ho interview me, interviewer turant impress hota hai.

Socho tumhare paas ek expensive function hai jo initial state calculate karta hai:

```js
const getInitialValue = () => {
  // heavy computation, jaise localStorage parse karna, bada array process karna
  return someHeavyCalculation()
}
```

Agar tum likho:

```js
useState(getInitialValue())   // ❌ () lagaya
```

JavaScript pehle `getInitialValue()` ko evaluate karega (kyunki function call hai), phir uska result `useState` ko dega. Problem yeh hai — yeh evaluation har render pe hoti hai, chahe React result sirf pehli render pe use kare. Matlab tum unknowingly har re-render pe wasted computation kar rahe ho.

**Fix:**

```js
useState(getInitialValue)   // ✅ bina () ke, sirf reference
```

Ab React samajh jata hai — *"yeh ek lazy initializer hai"* — aur ise sirf pehli baar call karega, kabhi nahi phir.

**Interview me bolne wali line:** *"`useState` do modes support karta hai — direct value ya lazy function. Jab initial value expensive ho, lazy initializer use karo, warna tum unknowingly performance waste kar rahe ho har render pe."*

---

### Q6. `useState` vs `useReducer` — kab konsa use karoge?

Yeh decision-making wala sawaal hai — interviewer dekhna chahta hai ki tumhe judgment hai ya sirf definitions rati hain.

`useState` tab tak perfect hai jab tak state simple aur independent ho — ek counter, ek boolean toggle, ek text input. Lekin jaise hi state complex ho jaye — matlab multiple related sub-values hain, updates ek dusre pe depend karte hain, ya bahut saare alag-alag actions state ko modify kar sakte hain — tab `useState` se code messy ho jata hai, bahut saare scattered `setX` calls ban jate hain.

`useReducer` yaha better hai kyunki saari update logic ek centralized jagah (reducer function) me rehti hai, aur components sirf "kya hua" (action) dispatch karte hain. Jaise shopping cart (add/remove/update quantity — sab related), ya multi-step forms.

**Ek line me:** *"State jitni simple, `useState` utna better. State jitni interconnected aur complex, `useReducer` utna better — kyunki wo logic ko centralize karta hai."*

---

### Q7. Kya `useState` ko component ke andar conditionally call kar sakte hain?

Nahi — aur yeh "Rules of Hooks" ka sabse important rule hai.

Curious part yeh hai — kyu nahi kar sakte? React hooks ko track kaise karta hai internally? React naam se track nahi karta, order se track karta hai. Har render pe React ek mental list banata hai — "pehla hook yeh tha, doosra yeh tha, teesra yeh tha" — aur agle render pe usi order ki expect karta hai.

Agar tum hook ko `if` condition ke andar daal do:

```js
if (someCondition) {
  const [x, setX] = useState(0)   // ❌ conditional hook
}
```

Toh ek render me yeh hook chalega (list me include hoga), doosre render me shayad na chale (list se missing ho jayega). React ka internal order mismatch ho jayega — aur React confuse ho jayega ki kaunsa state kis hook ka hai, kyunki wo purely position/order pe rely karta hai, naam pe nahi.

Isi wajah se rule hai — hooks hamesha top level pe, same order me, har render pe call hone chahiye. Conditional logic agar chahiye, toh hook ke andar condition daalo, hook ko condition ke andar mat daalo.

---

### Q1. What is `useState` and when do we use it?

Look, first understand this — React's job is to keep the UI in sync with data. If you use a normal JS variable, React has no idea the value changed, because React doesn't "watch" any variable by default.

`useState` fills that exact gap — it gives React a signal: *"watch this value, and whenever it changes, re-render the UI."* Technically it returns an array — the first element is the current snapshot, the second is a setter function that triggers a new render.

We use it whenever some part of the UI needs to be dynamic — changes based on user interaction or over time — form inputs, toggles, counters, anything that's not fixed on screen.

---

### Q2. Why does calling `setCount(count + 1)` twice only increase count by 1, not 2?

This is a really interesting gotcha — and it tests whether you actually understand closures or not.

Think of it this way — when the function runs, `count` is a "frozen snapshot" of that particular render — like a photo taken at that exact moment. Both `setCount(count + 1)` calls are looking at the same photo, both see the same old `count`. So both are saying "do 0 + 1," and the result is only `1` — not `2`.

To fix this, we use the functional update form:

```js
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

Here we're telling React — *"whatever the latest value is in the queue, apply this to it."* React processes these sequentially, so the second call uses the result of the first — giving the correct `2`.

**Rule of thumb:** Whenever new state depends on previous state, use the functional update. Never blindly reference `count` directly if it's based on the previous value.

---

### Q3. Is state update synchronous or asynchronous?

This one's tricky because technically the answer is "synchronous," but the behavior feels asynchronous — that's where the confusion comes from.

What happens internally — React 18 has automatic batching. Meaning if you call multiple `setState`s inside one event handler, React collects them together and applies them in a single re-render — it doesn't re-render for each `setState` separately. This is purely for performance — think about it, if every `setState` triggered a separate re-render, then 5 `setState` calls in one function would mean 5 re-renders — extremely wasteful.

That's why — if you `console.log(state)` right after calling `setState`, you'll see the old value, because the update is still queued, not applied yet. This is what confuses most people — they think "state updates are async," when actually it's batching that makes it look that way.

---

### Q4. Why do other fields disappear when we update just one field in an object state?

This question directly tests the difference between class component's `this.setState` and `useState` — a very common interview trap.

See, `this.setState` (in class components) used to automatically merge — you'd give it one field, and the rest would stay preserved. But `useState`'s setter follows a completely different philosophy — it only **REPLACES**, it doesn't merge.

```js
setUser({ name: 'Rahul' })   // entire object REPLACED, age is gone!
```

**Curious question — why did React design it this way, why not merge?** Because `useState` is generic — it's not built just for objects, it works for numbers, strings, booleans, everything. If React tried to auto-merge, that would only make sense for objects — merging a number or boolean doesn't even make conceptual sense. So for simplicity and consistency, React kept a replace behavior, and made merging the developer's responsibility.

**Fix:**

```js
setUser(prev => ({ ...prev, name: 'Rahul' }))
```

The spread operator copies the old data first, then overwrites the specified field.

---

### Q5. What is lazy initialization and when should we use it?

This is a concept very few people know, and when you say it in an interview, the interviewer is instantly impressed.

Imagine you have an expensive function that computes the initial state:

```js
const getInitialValue = () => {
  // heavy computation, like parsing localStorage, processing a big array
  return someHeavyCalculation()
}
```

If you write:

```js
useState(getInitialValue())   // ❌ called it
```

JavaScript will evaluate `getInitialValue()` first (since it's a function call), then pass the result to `useState`. The problem is — this evaluation happens on every render, even though React only uses the result on the first render. So you're unknowingly doing wasted computation on every re-render.

**Fix:**

```js
useState(getInitialValue)   // ✅ just the reference, no ()
```

Now React understands — *"this is a lazy initializer"* — and it will call it only once, never again.

**Line to say in interview:** *"`useState` supports two modes — a direct value or a lazy function. When the initial value is expensive to compute, use the lazy initializer, otherwise you're unknowingly wasting performance on every render."*

---

### Q6. `useState` vs `useReducer` — when do you use which?

This is a judgment-testing question — the interviewer wants to see if you have actual decision-making sense or just memorized definitions.

`useState` is perfectly fine as long as the state is simple and independent — a counter, a boolean toggle, a text input. But as soon as state becomes complex — meaning there are multiple related sub-values, updates depend on each other, or there are many different actions that can modify the state — `useState` code gets messy, with a bunch of scattered `setX` calls.

`useReducer` is better here because all the update logic lives in one centralized place (the reducer function), and components just dispatch "what happened" (an action). Like a shopping cart (add/remove/update quantity — all related), or multi-step forms.

**In one line:** *"The simpler the state, the more `useState` works. The more interconnected and complex the state, the more `useReducer` works — because it centralizes the logic."*

---

### Q7. Can you call `useState` conditionally inside a component?

No — and this is the most important rule from the "Rules of Hooks."

The curious part is — why not? How does React track hooks internally? React doesn't track by name, it tracks by order. On every render, React builds a mental list — "first hook was this, second was this, third was this" — and on the next render, it expects the same order.

If you put a hook inside an `if` condition:

```js
if (someCondition) {
  const [x, setX] = useState(0)   // ❌ conditional hook
}
```

Then in one render this hook runs (included in the list), and in another render it might not run (missing from the list). React's internal order gets mismatched — and React gets confused about which state belongs to which hook, because it purely relies on position/order, not name.

That's why the rule is — hooks must always be called at the top level, in the same order, on every render. If you need conditional logic, put the condition inside the hook, not the hook inside the condition.