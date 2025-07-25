
# 🎓 GradeLens – AI-Powered Student Performance Analyzer

GradeLens is an AI-driven web application that accepts student report cards in PDF format, extracts academic data, analyzes performance using Perplexity AI, and generates insightful visual reports. It identifies strengths, weaknesses, and offers targeted feedback with a downloadable performance report.

---

## 🚀 Features

- 📄 Upload and parse student PDF report cards
- 🤖 Analyze grades using **Perplexity AI** + **Model Context Protocol**
- 🧠 Generate subject-wise feedback, improvement suggestions, and merit points
- 📊 Visualize results with charts and graphs
- 📥 Download professionally formatted PDF report cards
- 🌐 Clean and modern UI with **shadcn/ui** and **Tailwind CSS**

---

## 🛠 Tech Stack

| Frontend        | Backend            | AI/NLP                  | PDF Tools       |
|-----------------|--------------------|-------------------------|-----------------|
| Next.js 15      | Server Actions     | Perplexity AI + MCP     | pdf-lib, pdf-parse |
| Tailwind CSS    | Edge Functions     | OpenAI SDK (optional)   | PDF.js (optional) |
| shadcn/ui       | TypeScript         |                         |                 |

---

## 📂 Project Structure

/app ├── upload/              # Upload page for PDF files ├── report/              # Render + download performance reports └── api/                 # PDF parsing and AI analysis endpoints /components ├── charts/              # Recharts for grade visualization └── ui/                  # Shared shadcn UI components /lib ├── analyze.ts           # AI performance logic └── pdf.utils.ts         # PDF parsing and formatting /types └── index.ts             # Student & subject type definitions

---

## 🧪 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/gradelens.git
cd gradelens

2. Install Dependencies

npm install

3. Set Up Environment Variables

Create a .env.local file:

OPENAI_API_KEY=your_openai_key  # (optional fallback) or any API you want to use

4. Run the App

npm run dev

Visit http://localhost:3000


---

🧠 How GradeLens Works

1. Upload PDF – A student report card is uploaded.


2. Parse & Extract – PDF is processed using pdf-parse.


3. Analyze with AI – Extracted data is sent to Open AI + MCP to:

Assess subject-level performance

Highlight strengths/weaknesses

Provide targeted suggestions



4. Report Generation – A visual report is created and can be downloaded.




---

📦 Future Enhancements

[ ] Batch upload multiple student PDFs

[ ] Admin dashboard with history and analytics

[ ] Email performance reports

[ ] Compare class-wide performance



---

📜 License

This project is licensed under MIT.


---

🙌 Credits

Perplexity AI

Clerk

NextJs

pdf-lib

shadcn/ui

OpenAI



---

> Built with ❤️ to empower🎯 students and educators through intelligent insights.

💬contact -krishpinninti789@gmail.com

---

