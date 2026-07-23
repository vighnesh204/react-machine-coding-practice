# 🔐 OTP Input

A sleek, auto-focusing OTP (One-Time Password) input component built with React — clean UI, smooth keyboard navigation, and zero external dependencies.

## ✨ Features

- 🔢 Auto-focus moves to the next box as you type
- ⌫ Backspace navigates back to the previous box
- 🚫 Numeric-only input validation
- 🎯 Auto-focus on the first input when the page loads
- 🎨 Modern dark-themed UI with smooth focus transitions

## 🛠️ Tech Stack

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/docs)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/guide/)


## 📸 Screenshot

![OTP Input Screenshot](./src/assets/pic.png)


## 💡 How It Works

Each input box is tracked via a `ref` array. On typing a digit, focus automatically shifts to the next box; on backspace with an empty box, focus shifts back — giving that classic, seamless OTP-entry feel.

---

⭐ If you like this project, consider giving it a star!