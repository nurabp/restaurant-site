# 🥇 Gourmet Place: A Fully Operational Restaurant Web Platform

> **My Final Project Submission.** I engineered a high-fidelity, interactive web application for a modern restaurant, focusing on mastering advanced **JavaScript (jQuery)** features, implementing a **secure client-side authentication system**, and integrating a **relevant external API**. "Gourmet Place" is a comprehensive, feature-rich platform designed for superior user experience.

## 🔗 Project Deployment & Source


## 🚀 Key Technical Achievements I Delivered

I built this project to prove my ability to handle complex, real-world development challenges. I utilized the **Local Storage API** as the primary client-side database for all user data and custom content.

### 1. 🔐 Robust Client-Side Authentication System

I successfully implemented a complete user management flow from start to finish, storing data securely (on the client side).

* **Sign Up & Log In:** I created working registration and sign-in forms with persistent session handling.
* **Profile Management:** Upon logging in, users are greeted by name in the navbar and gain access to a dedicated **"My Profile"** view showing their registered details (Name, Email, Phone, Membership Date).
* **Advanced Form Validation:** My project includes stringent validation checks on the registration form for:
    * Correct **Email** and **Phone Number** format.
    * **Password Complexity** (min. 8 chars, requiring uppercase, lowercase, and a number).
    * Password match verification.

### 2. 🌐 External API Integration: TheMealDB

To enrich the site beyond a static menu, I integrated the **TheMealDB API** into a dynamic **"🍳 Recipes"** section.

* **Dynamic Content:** The page loads popular recipes and offers real-time search and category filtering (e.g., Seafood, Beef, Dessert).
* **Rich Detail Modals:** When a user selects a recipe, a dedicated modal opens to display:
    * The full list of **Ingredients and Measures**.
    * Detailed, step-by-step **Cooking Instructions**.
    * A direct link to the **YouTube Video Tutorial**.

### 3. ⭐ Interactive and Persistent User Content

I focused on user retention by making the application feel personalized and sticky.

* **Rating System:** I implemented an interactive 5-star rating feature directly on menu items.
* **Data Persistence:** All user ratings are immediately **saved to `localStorage`** and correctly displayed upon subsequent visits.
* **Menu Filtering:** I included a reliable Search and Filter functionality for the main menu items, complete with **visual highlighting** of search terms.

---

## 🎨 Design and Technical Foundation

* **Flawless Responsiveness:** I engineered the layout using **Bootstrap 5**, ensuring an exceptional viewing experience across all devices (Desktop, Tablet, Mobile).
* **Dual Mode UI:** The application features a fully implemented **Light and Dark Mode** toggle, with the user's preference saved persistently.
* **Professional Aesthetics:** My custom styling, combined with Bootstrap components, results in a clean, modern, and high-contrast design that is visually appealing and highly usable.

## 🛠️ My Technology Stack

**I developed this project using:**

* **Languages:** JavaScript (ES6+), HTML5, CSS3
* **Libraries:** jQuery 3.7.1, Bootstrap 5
* **Data Handling:** Local Storage API
* **External Service:** TheMealDB API
