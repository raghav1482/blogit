# Blogit Blogging Platform

Blogit is a web application designed to empower users to create and share their blogs easily. Whether you're a seasoned writer or just starting, Blogit provides a seamless platform for expressing your thoughts, stories, and ideas.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Prompt is built to simplify the process of creating and sharing blogs. It offers a user-friendly interface for writing, formatting, and publishing articles. With integrated features for user authentication and content management, Prompt ensures a smooth blogging experience for both writers and readers.

## Features

- **Create and Edit Blogs**: Users can easily create new blog posts or edit existing ones using a simple and intuitive editor.
- **Rich Text Formatting**: Formatting options such as bold, italic, headings, and lists allow writers to style their content effectively.
- **Media Integration**: Seamlessly embed images and videos into blog posts to enhance the reading experience.
- **Tagging and Categorization**: Blogs can be tagged and categorized for better organization and discovery.
- **User Authentication**: Secure authentication using NextAuth.js to manage user accounts.
- **Responsive Design**: The application is designed to adapt to various devices and screen sizes for optimal viewing.
- **External Services Integration**: Integration with cloudinary for image hosting and axios for handling HTTP requests.

## Tech Stack

- **Frontend**: React.js, Next.js
- **UI Library**: Tailwind CSS
- **Authentication**: NextAuth.js
- **HTTP Requests**: Axios
- **Database**: MongoDB (using Mongoose)
- **Image Hosting**: Cloudinary

## Getting Started

To start using Prompt, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Populate the necessary environment variables (e.g., database connection string, API keys)
4. Run the development server: `npm run dev`
5. Visit `http://localhost:3000` in your browser to access the application.

## Usage

- Visit the homepage to browse existing blogs or create new ones.
- Sign in to access additional features such as editing and deleting blogs.
- Use tags and categories to filter blogs based on specific topics or themes.
- Share your blogs with others via social media or direct links.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
