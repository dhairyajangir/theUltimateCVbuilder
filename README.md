# Ultimate AI-Powered Resume Builder App

Get the Pro version for free: [theUltimateCV](https://ultimatecv.netlify.app)

## Overview

**theUltimateCVbuilder** is a modern, AI-powered web application that enables users to create professional, customizable resumes (CVs) with ease. Designed for job seekers and professionals, it leverages advanced career advising technologies to help users optimize their CVs for Applicant Tracking Systems (ATS), tailor content for specific professions, and export polished PDFs.

## Features

- **Intuitive Form-Based CV Builder:** Guided input for personal info, education, experience, skills, projects, certifications, and references.
- **AI-Powered Suggestions:** Real-time grammar corrections and professional summary recommendations.
- **Profession-Specific Insights:** ATS keywords, salary range, certifications, industry trends, recommended courses, and project ideas for selected professions.
- **Multiple Templates:** Choose from Modern, Classic, and Minimal designs for instant visual customization.
- **PDF Export:** Download print-ready, high-quality resumes with optimized formatting.
- **Theme Support:** Light and dark mode for comfortable editing.
- **Error Handling:** Robust error boundaries for a smooth user experience.

## Technologies Used

- **React & TypeScript** for front-end development
- **TailwindCSS** for responsive UI/UX
- **Google Generative AI** for career insights and suggestions
- **html2canvas & jsPDF** for PDF generation

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- npm or yarn

### Installation

```bash
git clone https://github.com/dhairyajangir/theUltimateCVbuilder.git
cd theUltimateCVbuilder
npm install   
```

### Configuration

1. Get a Gemini API Key from Google Generative AI.
2. Create a `.env` file in the root directory:
    ```
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

### Run Locally

```bash
npm run dev   
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

- Fill out sections in the form to build your CV.
- Choose your preferred template.
- Preview and export your resume as a PDF.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Google Generative AI](https://ai.google/) for powering career insights
- [html2canvas](https://github.com/niklasvh/html2canvas) and [jsPDF](https://github.com/parallax/jsPDF) for PDF export

---
**Build your ultimate CV and unlock professional opportunities!**
