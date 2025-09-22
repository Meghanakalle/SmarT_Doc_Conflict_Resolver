📘 Smart Doc Checker Agent

An intelligent system to detect document inconsistencies, overlaps, and conflicts with a clean, professional UI. Built with modern web technologies, this MVP provides authentication, document uploads, AI-driven mock analysis, and detailed reporting.

LIVE LINK - https://aquamarine-sundae-19a0cd.netlify.app/

🚀 Tech Stack

Vite – Fast build tool for frontend development

TypeScript – Strict typing for safer code

React – Component-based UI framework

Smart Doc Checker Agent/ui – Pre-built, modern UI components

Tailwind CSS – Utility-first styling framework

ℹ️ All Smart Doc Checker Agent/ui components are pre-downloaded under @/components/ui.

📂 File Structure
├── index.html                # HTML entry point

├── vite.config.ts            # Vite configuration

├── tailwind.config.js        # Tailwind CSS configuration

├── package.json              # Dependencies & scripts

├── src

│   ├── app.tsx               # Root component

│   ├── main.tsx              # Project entry point

│   ├── index.css             # Global CSS

│   ├── pages

│   │   ├── Index.tsx         # Home page

│   │   ├── Auth.tsx          # Login/Signup page

│   │   ├── Dashboard.tsx     # Dashboard overview

│   │   ├── Upload.tsx        # Document upload interface

│   │   ├── Analysis.tsx      # Analysis loading screen

│   │   ├── Report.tsx        # Single report details

│   │   ├── Reports.tsx       # Reports history

│   │   ├── Integrations.tsx  # External monitoring

│   ├── components

│   │   ├── Sidebar.tsx       # Sidebar navigation

│   │   ├── ConflictCard.tsx  # Conflict detail display

│   ├── lib

│   │   ├── auth.ts           # Authentication utilities

│   │   ├── storage.ts        # LocalStorage management

│   ├── types

│       └── index.ts          # TypeScript type definitions

✨ Core Features (MVP)

🔐 Authentication System – Secure login/signup with validation

📊 Dashboard – Metrics overview & quick actions

📂 Document Upload – Upload PDFs, DOCX, TXT, PPT

🤖 AI Conflict Detection (Mock) – Detect overlaps & contradictions

📑 Report Generation – Exportable conflict reports

🌐 External Monitoring – Mock integration with policies

📈 Usage Analytics – Track number of analyses & reports

🛠️ Development Notes

Import UI components from @/components/ui

Customize UI with Tailwind classes and tailwind.config.js

Add global styles in src/index.css or custom CSS files

Use localStorage for demo persistence (mock data only)

Mock AI detection with realistic examples

Ensure form validation & error handling

UI designed for responsive layouts (desktop, tablet, mobile)

📌 Implementation Plan

Setup Auth system with validation

Build Dashboard UI with metrics

Create Upload flow (multi-file support)

Add Mock AI conflict analysis

Implement Report view + export

Setup Reports history page

Add External monitoring integration (mock APIs)

Track usage via Analytics


