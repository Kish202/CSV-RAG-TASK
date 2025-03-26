# CSV RAG Application

A comprehensive CSV data analysis application with a FastAPI backend and React frontend. This application enables users to upload CSV files, analyze them, and query the data using natural language processing through OpenAI's GPT models.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage Guide](#usage-guide)
  - [Uploading CSV Files](#uploading-csv-files)
  - [Querying Data](#querying-data)
  - [Managing History](#managing-history)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application implements a Retrieval-Augmented Generation (RAG) system for CSV files. It allows users to upload CSV data, which is then processed, analyzed, and stored in MongoDB along with metadata. Users can then query this data using natural language, and the application leverages OpenAI's GPT models to provide relevant answers based on the CSV content.

## Features

- **CSV Data Management**:
  - Upload CSV files through a modern web interface
  - Automatic metadata extraction (rows, columns, data types, statistics)
  - CSV summary generation for quick overview

- **Natural Language Querying**:
  - Ask questions about your data in plain English
  - Get AI-powered responses based on your CSV content
  - Contextual awareness of data structure and statistics

- **User Experience**:
  - Modern, responsive UI using shadcn/ui components
  - Query history tracking and management
  - Real-time feedback and error handling

- **Technical Features**:
  - Asynchronous backend processing
  - MongoDB integration for data storage
  - OpenAI API integration for natural language understanding
  - Comprehensive error handling and validation

## Technical Architecture

The application consists of two main components:

### Backend (FastAPI)

- **Framework**: FastAPI for high-performance asynchronous API
- **Database**: MongoDB for storing CSV data and metadata
- **AI Integration**: OpenAI GPT-3.5 Turbo API for natural language processing
- **Data Processing**: Pandas for CSV analysis and manipulation

### Frontend (React)

- **Framework**: React for component-based UI development
- **UI Library**: shadcn/ui (built on top of Tailwind CSS)
- **State Management**: React hooks for local state and localStorage for history
- **HTTP Client**: Custom API client for backend communication

## Project Structure

```
csv-rag-task/
├── backend/
│   ├── data                    # Sample data
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ui/             # shadcn/ui base components
│   │   │   ├── FileUpload.jsx  # File upload component
│   │   │   ├── FileList.jsx    # File listing component
│   │   │   ├── QueryInterface.jsx # Query interface component
│   │   │   └── QueryHistory.jsx  # History component
│   │   ├── lib/
│   │   │   ├── api.js          # API client
│   │   │   └── storage.js      # localStorage utilities
│   │   ├── pages/
│   │   │   └── HomePage.jsx    # Main application page
│   │   ├── App.jsx             # Main React component
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Node.js dependencies
│   ├── vite.config.js          # Vite configuration
│   └── tailwind.config.js      # Tailwind CSS configuration
└── README.md                   # Project documentation
```

## Installation & Setup

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kish202/CSV-RAG-TASK.git
   cd csv-rag-task/backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URL=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   HOST=0.0.0.0
   PORT=8000
   ```

   - For MongoDB, you can use MongoDB Atlas (cloud) or a local MongoDB instance
   - For OpenAI API key, sign up at [OpenAI](https://platform.openai.com/) and generate an API key

5. **Start the backend server**:
   ```bash
   python main.py
   ```
   
   The server will start on `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the frontend directory with:
   ```
   VITE_APP_API_URL=http://localhost:8000
   ```

4. **Install shadcn/ui components**:
   ```bash
   npx shadcn-ui@latest init
   
   # Install the required components
   npx shadcn add card button input textarea alert badge table accordion skeleton select alert-dialog scroll-area theme-provider 
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## Usage Guide

### Uploading CSV Files

1. Open the application in your browser
2. In the upload section, click "Choose File" or drag and drop a CSV file
3. Click the "Upload" button
4. Once uploaded, the file will appear in the list on the right side
5. The file will be automatically selected for querying

### Querying Data

1. With a file selected in the dropdown menu, type your question in the query box
2. Questions can be about the data structure, statistics, or specific information in the file
3. Examples:
   - "What's the average value in column X?"
   - "Which row has the highest value for Y?"
   - "Summarize the trends in this data"
   - "How many records match the criteria Z?"
4. Press the "Submit Query" button or use Ctrl+Enter to send your query
5. The response will appear below the query box

### Managing History

1. Click the "History" button in the query interface
2. View all your past queries and their responses
3. Delete individual queries or clear the entire history
4. Click on any past query to expand and view the full response

## API Documentation

### Endpoints

- **POST /upload**
  - Description: Upload a CSV file
  - Request: `multipart/form-data` with file parameter
  - Response: `{ "file_id": "string", "message": "Upload successful" }`
  - Status Codes: 
    - 200: Success
    - 400: Invalid file format
    - 500: Server error

- **GET /files**
  - Description: Get a list of all uploaded files
  - Response: `{ "files": [{ "file_id": "string", "file_name": "string" }] }`
  - Status Codes:
    - 200: Success
    - 500: Server error 

- **POST /query**
  - Description: Query a CSV file using natural language
  - Request: `{ "file_id": "string", "query": "string" }`
  - Response: `{ "response": "string" }`
  - Status Codes:
    - 200: Success
    - 404: File not found
    - 500: Server error

- **DELETE /file/{file_id}**
  - Description: Delete a specific file
  - Response: `{ "message": "File deleted successfully" }`
  - Status Codes:
    - 200: Success
    - 404: File not found
    - 500: Server error

## Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the service:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in the Render dashboard
6. Deploy the service

### Frontend Deployment (Netlify)

1. Update the .env file with your deployed backend URL
2. Build the frontend:
   ```bash
   npm run build
   ```
3. Deploy to Netlify:
   - Drag and drop the `dist` folder to Netlify, or
   - Connect your GitHub repository and configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
4. Add environment variables in the Netlify dashboard

## Customization

### Styling

The application uses shadcn/ui components built on Tailwind CSS. To customize the styling:

1. Modify the `tailwind.config.js` file to change colors, fonts, etc.
2. Edit the CSS variables in `src/index.css` for theme customization
3. Modify component styling in individual component files

### OpenAI Model

You can change the OpenAI model used for queries by modifying the backend code:

```python
# In main.py, find the query_csv function
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",  # Change to another model like "gpt-4" if you have access
    messages=[
        # ...
    ]
)
```

### MongoDB Configuration

You can customize the MongoDB configuration in the backend code:

```python
# In main.py
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.csv_database  # Change database name
files_collection = db.files  # Change collection name
```

## Troubleshooting

### Backend Issues

- **MongoDB Connection Errors**: 
  - Verify the MONGODB_URL in your .env file
  - Ensure network connectivity to the MongoDB server
  - Check if IP allowlisting is required for MongoDB Atlas

- **OpenAI API Errors**:
  - Verify your OPENAI_API_KEY is valid and has sufficient credits
  - Check for rate limiting or quota issues

- **File Upload Errors**:
  - Ensure the file is a valid CSV file
  - Check file size (there may be limitations)

### Frontend Issues

- **API Connection Errors**:
  - Verify the REACT_APP_API_URL in your .env file
  - Ensure CORS is properly configured on the backend
  - Check if the backend server is running

- **Component Rendering Issues**:
  - Check browser console for JavaScript errors
  - Verify all dependencies are installed correctly

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.