Personal Budget Tracker System
This is a simple, personal budget tracker system developed using Flask. The application allows users to easily add, view, edit, and delete financial transactions, helping them to keep a clear record of their income and expenses. All transaction data is stored locally in a data.json file, making it a lightweight and self-contained solution.

Features
Add Transactions: Quickly add new income and expense entries with details such as amount, category, and a description.

View Transactions: See a comprehensive list of all your financial transactions.

Edit & Delete: Easily modify or remove existing transactions.

Search Functionality: Filter transactions in real-time by searching for keywords in the category, type, or note.

Data Visualization: A bar chart provides a visual breakdown of expenses by category.

Exporting: Download the expense chart or the entire page as a PNG, JPG, or PDF document.

Local Data Storage: All your data is saved locally in a data.json file, ensuring your financial information is kept private.

Automatic Launch: The application automatically opens a web browser to the dashboard when it starts.

Technologies Used
Backend:

Python (Flask): The micro-framework for handling server-side logic and API endpoints.

Frontend:

HTML: For the structure and layout of the user interface.

CSS: For styling the application and ensuring a clean, modern look.

JavaScript: Manages all client-side logic, including form submissions, data fetching, and dynamic updates to the DOM.

Chart.js: Used to generate a visual bar chart of expenses by category.

html2canvas & jsPDF: External libraries used to enable exporting the chart or the full page to various file formats.

Application Logic
The application operates as a single-page application, with the script.js file managing all the front-end behavior.

Data Management: On page load, the loadTransactions() function fetches all transaction data from the Flask API at the /transactions endpoint.

CRUD Operations: The script listens for form submissions to add new transactions (/add), and it sends DELETE and PUT requests to the /delete/<id> and /edit/<id> endpoints to manage transactions.

UI Updates: The renderTransactions() function dynamically builds the transaction table and updates the income, expense, and balance totals on the page.

Data Visualization: The updateCategoryChart() function uses Chart.js to create a bar chart, giving a visual breakdown of expenses.

Search Functionality: An event listener on the search input filters the displayed transactions in real-time.

Modals: A modal is used for editing transactions, providing a clean user experience without navigating away from the page.

Frontend Structure
The index.html file is the core of the application's user interface. It is a single-page dashboard that contains all the interactive elements. The page is divided into several key sections:

Summary: At the top of the page, this section displays a live summary of your total income, total expenses, and current balance.

Transaction Form: A simple form allows users to input new transaction details, which are then added to the system via a POST request to the backend.

Transaction Table: This table dynamically populates with transactions fetched from the server. Each row includes actions to edit or delete the transaction.

Category Chart: A canvas element displays a bar chart of your expenses, powered by Chart.js.

Export Buttons: A set of buttons allows users to download the chart or the entire page as an image or a PDF document, using the html2canvas and jsPDF libraries.

Edit Modal: A hidden pop-up modal appears when a user clicks the "Edit" button on a transaction, allowing them to modify the details.

Styling and Responsiveness
The application's design is managed by style.css, which provides a clean and modern user experience.

Layout: The main content is centered with a max-width for readability. A subtle green and blue color palette is used to provide a calm, organized feel.

Forms and Buttons: The input fields and buttons are styled with rounded corners and consistent padding. The "Add Transaction" button changes color on hover, and the action buttons for editing and deleting have distinct colors for clarity.

Summary & Table: The summary section uses flexbox to arrange the total income, expenses, and balance. The transaction table features clear headers and alternating row colors.

Responsive Design: The layout is fully responsive, adapting seamlessly to smaller screens. On mobile devices, the summary and form elements stack vertically, and the transaction table transforms into a "card" layout with clear labels for each piece of data, ensuring it remains easy to read and use.

Getting Started
To get a copy of the project up and running on your local machine for development and testing, follow these steps.

Prerequisites
You will need to have Python and pip installed.

python --version
pip --version

Installation
Clone the repository:

git clone https://github.com/your-username/personal-budget-tracker.git
cd personal-budget-tracker

Install the required Python package:

pip install Flask

Run the application:

python app.py

The application will start, and a web browser will automatically open to http://127.0.0.1:5000/.

File Structure
The project is structured as follows:

personal-budget-tracker/
├── app.py
├── data.json
├── templates/
│   └── index.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
