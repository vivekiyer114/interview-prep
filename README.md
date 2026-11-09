# Prep Desk

A checklist of 647 interview-prep concepts drawn from three years of platform, payments, web, infrastructure and AI work, plus a DSA roadmap for a Google Staff coding round. Each card is a title and a one-line description: study it on your own, then mark it done.

**Live:** https://vivekiyer114.github.io/interview-prep/

- **Fundamentals:** 335 concepts in 17 categories, from security and databases to payments, frontend and mobile WebViews.
- **AI Engineering:** 68 concepts in 8 categories, covering LLM basics, RAG, agents, guardrails, evaluation, streaming UX and voice agents.
- **DSA:** 244 concepts in 31 categories and 535 linked LeetCode problems (all of the Blind 75 included). A Google Staff (L6) coding-round roadmap layered as problems → patterns → tools → fundamental blocks. Each pattern card has a deep dive with recognition cues, the core idea, a Python template, pitfalls, a staff-level follow-up and LeetCode problems you can tick off one by one. Problems are flagged G (reported in Google loops) and B75 (Blind 75).
- Search (press `/`), All / To do / Done filters and per-category progress.
- Progress is saved in your browser's localStorage, so it is per browser and per device.

## Run locally

Open `index.html` in a browser. There is no build step and there are no dependencies.

## Edit the list

Concepts live in `concepts.js` as `[title, description]` pairs grouped by category. Renaming a title clears that card's done mark.

The DSA tab lives in `dsa.js`. Its items take an optional third element with deep-dive details (`tier`, `recognize`, `idea`, `template`, `pitfalls`, `staff`, `problems`, `tools`, `blocks`). `tools` and `blocks` must match card titles in the Tools and Fundamental Blocks layers exactly. A problem's done mark is keyed on its LeetCode number, so it stays ticked under every pattern that lists it.
