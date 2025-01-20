# Gomarble_assignment
# Review Extraction API

## Overview

The Review Extraction API is a Flask-based web application that retrieves reviews from specified URLs using Playwright for web scraping and OpenAI's GPT-3.5-turbo model to dynamically identify CSS selectors for parsing review data. This project aims to provide an efficient way to extract structured review information from various online platforms.

## Solution Approach

1. **Web Scraping**: 
   - The application uses Playwright to navigate to a specified URL and extract HTML content.
   - It leverages OpenAI's GPT-3.5-turbo model to dynamically identify CSS selectors for review titles, bodies, ratings, and reviewers.

2. **Dynamic Selector Extraction**:
   - The HTML content of the page is sent to the OpenAI API, which returns the appropriate CSS selectors needed to scrape reviews.
   - The application then uses these selectors to gather review data from the page.

3. **API Design**:
   - The API exposes endpoints that allow users to request reviews by providing a URL.
   - The application handles errors gracefully, including rate limits from the OpenAI API.


## Instructions to Run the Project

### Prerequisites

- Python 3.7 or higher
- An OpenAI API key
- Flask,playwright

### Installation Steps

1. **Create a Virtual Environment**:
python -m venv venv
source venv/bin/activate # On Windows use venv\Scripts\activate
text

2. **Install Required Packages**:
pip install flask playwright openai python-dotenv
playwright install # Install required browsers for Playwright.
text

3. **Set Up Environment Variables**:
Create a `.env` file in the root directory of your project and add your OpenAI API key:
OPENAI_API_KEY=your_openai_api_key_here
text

### Running the Application

To start the Flask application, run:

python app.py
text

The application will be accessible at `http://127.0.0.1:5000/`.

## API Usage

### Endpoint: `/api/reviews`

**Method**: `GET`

**Description**: Fetch reviews from a specified URL.

### Request Example

GET /api/reviews?page=https://example.com/product-reviews
text

### Sample Response

{
"reviews_count": 3,
"reviews": [
{
"title": "Great Product!",
"body": "I really loved this product. It works perfectly.",
"rating": 5,
"reviewer": "John Doe"
},
{
"title": "Not Bad",
"body": "The product is okay but could be improved.",
"rating": 3,
"reviewer": "Jane Smith"
},
{
"title": "Terrible Experience",
"body": "I had a bad experience with this product.",
"rating": 1,
"reviewer": "Alice Johnson"
}
]
}
text

### Error Handling

If there are issues with the request (e.g., missing URL parameter), the response will look like this:

{
"error": "URL parameter is required"
}
text

If the application exceeds its quota with OpenAI:

{
"error": "Failed to fetch reviews after multiple attempts."
}
text

## Conclusion

This Review Extraction API provides a powerful tool for retrieving structured review data from various online platforms using advanced web scraping techniques and AI-driven selector identification.



