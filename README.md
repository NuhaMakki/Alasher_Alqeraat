# Alqeraat Alasher - QURANIC Web App

📅 **Development Duration:** October 2024 – February 2025  
🌐 **Live Demo:** [Visit the Web App](https://your-hosted-web-link.com)

> **Note:**  
> - The hosted version uses a **sample database**, not the full one due to content rights.  
> - The web app may be **slow to load on the first visit** because it is hosted on a free server.

<br><br>

## 📌 Project Description

**Alqeraat Alasher - QURANIC Web App** is a full-stack web platform that helps students and teachers of Quranic recitation (Qira’at) navigate and understand complex variations across the **Ten Qira’at** using a structured and searchable interface.

The application is based on data from the book **"[النشر في القراءات العشر](https://shamela.ws/book/22642)" (al-Nashr fi al-Qira’at al-‘Ashr)** by **Ibn Al-Jazari**, one of the most authoritative sources on Qira’at. This book contains intricate details of **تحريرات القراءات**—subtle variations in pronunciation and recitation that are essential for advanced Quranic studies.


<br><br>

## 💡 Problem It Solves

Traditionally, accessing this knowledge required navigating dense classical texts, reference books, and complex tables. This project simplifies that by:

- 📘 Digitizing the data from the authoritative source: *al-Nashr fī al-Qirā’āt al-‘Ashr* by Ibn Al-Jazari
- 🗃️ Organizing it into a structured MySQL database
- 🌐 Providing a user-friendly web interface to explore and analyze the data efficiently


> ### 🔧 Key capabilities include:

- 🔍 Searching for specific **Khilāfāt** (اختلافات) such as:
  - **Hamz Sākin** (همز ساكن)
  - **Madd Munfaṣil** (مد منفصل)  
  The app dynamically generates tables based on what the user wants to explore — allowing in-depth analysis of how each rule is applied by different Qāri’, Rāwī, and Ṭarīq.

- 🧭 Filtering by:
  - **Qāri’** (Reader)
  - **Rāwī** (Narrator)
  - **Ṭarīq** (Transmission path)

- 📖 Searching how a specific **Āyah in a Sūrah** is read — the app displays all reading variations across the 10 Qira’at for that verse.



> ### 🔍 Real Use Case

For example, a student wants to know how the **Hamzah Sākinah** is pronounced in a certain word by **Imam Qālūn** via **Tariq Abi Nasheet**. Instead of searching multiple pages in a book, they can:

1. Visit the web app
2. Search for the word
3. Filter by Qāri’, Rāwī, or Ṭarīq
4. Instantly view the results

<br><br>
## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS, CSS, JavaScript, Bootstrap  
- **Database:** MySQL


<br><br>

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/NuhaMakki/Alasher_Alqeraat.git
cd Alasher_Alqeraat
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure the Database
Note: Only a sample Database is included due to content rights.
To connect your own MySQL database, Modify `/config/database.js` to match your MySQL configuration (if needed):

1. Open the configuration file: `/config/database.js`
2. Edit the MySQL settings:

edit the configuration file: `/config/database.js`
```bash
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Database host
    database: process.env.DB_NAME,     // Database name
    user: process.env.DB_USER,         // Database user
    password: process.env.DB_PASSWORD, // Database password
    port: process.env.DB_PORT,         // Database port
    // Additional settings as required
});
```


### 4. Run the Project
```bash
node index.js
```

By default, the server runs on `http://localhost:3000`.


<br><br>

## 🎥 Demo & Walkthrough




## 📖 Features

- 🔍 Search and filter **تحريرات القراءات** by Qāri’ (قارئ), Rāwī (راوي), or Ṭarīq (طريق)
- 📚 Detailed view of recitation rules such as:
  - **Madd Munfaṣil (مد منفصل)**
  - **Hamz Sākin (همز ساكن)**
  - Replacements or pronunciations of specific letters
- 📑 Export and download reports as PDF
- 📊 Interactive, organized data tables with easy navigation
- 🌐 RTL (Right-to-Left) support for Arabic content
- 💡 Manual and methodology pages for guidance

---

## ⚠️ Disclaimer

- 📦 **Database Not Included**:  
  Due to content rights and size limitations, the full database is **not included** in this repository. Only the web application code is provided.

- 🔒 **Hosted Web Version Notice**:  
  - The online version uses a **sample/test database**, not the full, detailed version.
  - Performance may be **slightly delayed** on first access due to the nature of **free hosting services**.

---

## 🤝 Contributors

Developed by a Computer Science graduate in collaboration with Quran teachers and experts in Qira’at, aiming to simplify access to complex Quranic knowledge using modern technology.

---

## 📬 Contact

For questions, feedback, or collaboration:

- GitHub Issues: [Open an issue](https://github.com/your-username/QURANICWebDevelopment/issues)
- Email: your.email@example.com

---

## 📄 License

This project is licensed for **educational and non-commercial use**. Redistribution of the full dataset is not allowed without proper authorization.

---


تحرير


