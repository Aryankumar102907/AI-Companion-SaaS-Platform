# 🚀 AI Companion SaaS Platform

## Your Personalized AI Tutor & Companion

Welcome to the **AI Companion SaaS Platform** – an innovative application designed to provide personalized AI companionship and tutoring experiences. Whether you're looking to learn a new subject, practice a language, or simply have an engaging conversation, our AI companions are here to help!

--- 

## ✨ Features

-   **Intelligent AI Companions:** Engage with AI tutors across various subjects like Maths, Language, Science, History, Coding, and more.
-   **Real-time Voice Sessions:** Experience natural, real-time voice conversations with your AI companion.
-   **Customizable Companions:** Create and configure companions with unique voices and styles.
-   **Session History & Tracking:** Keep track of your past sessions and learning progress.
-   **Subject-Specific Learning:** Tailored content and interactions based on your chosen subject and topic.
-   **Automated Session Timer:** Sessions automatically conclude after a pre-defined duration, ensuring focused and efficient learning.
-   **Responsive UI:** Seamless experience across all devices.

## 🛠️ Technologies Used

-   **Next.js 15:** For a powerful and scalable React framework.
-   **React 19:** Building dynamic and interactive user interfaces.
-   **Tailwind CSS:** For rapid and utility-first styling.
-   **Clerk:** For secure and seamless user authentication.
-   **Supabase:** As our backend-as-a-service for database and authentication.
-   **Vapi.ai:** Powering the real-time AI voice interactions.
-   **Zod:** For robust schema validation.
-   **Lottie React:** For engaging animations.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Make sure you have the following installed:

-   Node.js (v18 or higher)
-   npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/saas-js.git
    cd saas-js
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your environment variables. (e.g., Clerk, Supabase, Vapi.ai API keys).

    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    VAPI_API_KEY=your_vapi_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For any inquiries, please open an issue in the repository.