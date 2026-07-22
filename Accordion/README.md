# React Accordion

A minimal, accessible accordion component built with React and Tailwind CSS, using react-icons for the expand/collapse indicators.

## Preview

Dark-themed, single-open accordion — clicking an item expands it and collapses any other open item.

## Screenshot

![Accordion Screenshot](.\src\assets\accordion.png)

## Tech Stack

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/docs)
[![React Icons](https://img.shields.io/badge/React_Icons-E91E63?style=for-the-badge&logo=react&logoColor=white)](https://react-icons.github.io/react-icons/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Installation

```bash
npm install react-icons
```

Tailwind CSS must already be configured in your project ([setup guide](https://tailwindcss.com/docs/installation)).

## Usage

```jsx
import Accordion from './components/Accordion';

const data = [
  { title: "Components", description: "Reusable building blocks used to create React user interfaces." },
  { title: "Props", description: "Used to pass data from a parent component to a child component." },
];

const App = () => <Accordion data={data} />;

export default App;
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `Array<{ title: string, description: string }>` | List of accordion items to render |

## Features

- Single-item-open behavior (opening one closes the others)
- Smooth hover states and dark UI styling
- Chevron icon toggles between up/down on open/close
- Graceful fallback message when `data` is empty or undefined

