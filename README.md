# SaveWise (Frontend)

SaveWise helps people decide how much to save each month. Enter your income and expenses, see what is left over, choose an amount and a goal, and record a demo deposit. No real money moves.

Capstone Brief 3, Financial Technology (BeTechified Advanced Class, Group 3). This repository is the **frontend**.

- **Live demo:** https://savewise-sigma.vercel.app/
- **Repository:** https://github.com/sky5532/savewise
- **Frontend developer:** Adzorge Richard Quarshie ([@sky5532](https://github.com/sky5532))

## Tech stack

- **Next.js 16** (App Router) with **React** and **TypeScript**
- **Tailwind CSS v4** with a custom theme taken from the product design (green `#176B50`, gold `#D9A441`, and the rest of the palette)
- **Fetch API** wrapper (`lib/api.ts`) for the backend REST API, including token refresh
- Deployed on **Vercel**

## Key features

- **Account screens:** welcome, sign up and login, connected to the backend API. Sessions persist between visits.
- **Seven-screen Save Now flow**, each step its own page: financial setup, savings recommendation, choose amount, select goal, review, confirm demo deposit, success.
- **Savings rule:** suggested amount = 20% of (income − expenses), always shown as a visible calculation and labelled as an estimate, not financial advice.
- **Validation that follows the design notes:** clear inline errors with focus moved to the field, a ₦0 suggestion and no deposit when expenses are equal to or higher than income, and an amount that can never exceed the remaining balance.
- **Confirm step:** Cancel returns to Review, and a deposit can only be recorded once.
- **Dashboard (Home):** demo wallet balance, goal progress bars and recent activity, with empty states.
- **Goals, History and Profile screens** with a bottom navigation bar.
- **Amounts handled in kobo** and formatted as naira (₦), matching the API.
- **Responsive, mobile-first layout** with labelled form fields, keyboard focus styles and status messages for screen readers.

## What is connected to the API and what is not

| Area | Status |
|---|---|
| Register, login, session, current user | Connected to the backend API |
| Goals, wallet balance, deposits, transaction history | Stored locally in the browser for the demo, so they do not follow the user to another device |
| Forgot and reset password | Backend endpoints exist, but the screens are not built yet |
| Profile settings (personal information, security, preferences, notifications) | Listed as "Coming soon" |

## Run locally

```bash
git clone https://github.com/sky5532/savewise.git
cd savewise
npm install
```

Create a file named `.env.local` in the project root:

```
NEXT_PUBLIC_API_URL=https://save-wise-nodejs-api-server.onrender.com
```

Then start the app:

```bash
npm run dev
```

Open http://localhost:3000. If the backend has been idle, the first request can take up to a minute while the server wakes up.

## Project structure

```
app/
  page.tsx          Welcome screen
  login/, signup/   Account screens
  (app)/            Home, Goals, History, Profile with the bottom navigation
  save/             The seven-step Save Now flow and its shared state
lib/
  api.ts            API request helper with token refresh
  auth.ts           Session storage and types
  calc.ts           The savings calculation
  money.ts          Naira and kobo helpers
  savings.ts        Goals and deposits (local demo store)
```

## Security notes

- Tokens are kept in `localStorage` for simplicity. This is acceptable for a demo, but a production app should use secure, HTTP-only cookies.
- No real money, bank connection or payment is part of this MVP.

## Known limitations and next steps

- Move goals, deposits and history to the backend endpoints so data follows the user across devices.
- Build the forgot and reset password screens.
- Make the Profile settings editable.
- Add charts for savings growth.

## Screenshots

_Add screenshots of the key screens here._