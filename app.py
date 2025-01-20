import os
import logging
from flask import Flask, request, jsonify, send_from_directory
from playwright.async_api import async_playwright
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Configure logging
logging.basicConfig(filename='error.log', level=logging.ERROR)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def get_dynamic_selectors(page_content):
    response = client.chat.completions.create(
    model="gpt-4o",
    store=True,
        messages=[
            {"role": "user", "content": f"Identify CSS selectors for review titles, bodies, ratings, and reviewers in the following HTML:\n{page_content}"}
        ]
    )
    return response.choices[0].message.content

async def extract_reviews(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(url)
        
        # Get the page content for LLM processing
        page_content = await page.content()
        selectors = await get_dynamic_selectors(page_content)
        title_selector, body_selector, rating_selector, reviewer_selector = selectors.splitlines()
        
        reviews = []
        while True:
            titles = await page.query_selector_all(title_selector)
            bodies = await page.query_selector_all(body_selector)
            ratings = await page.query_selector_all(rating_selector)
            reviewers = await page.query_selector_all(reviewer_selector)
            
            for title, body, rating, reviewer in zip(titles, bodies, ratings, reviewers):
                reviews.append({
                    "title": await title.inner_text(),
                    "body": await body.inner_text(),
                    "rating": int(await rating.inner_text()),
                    "reviewer": await reviewer.inner_text()
                })
            
            next_button = await page.query_selector('a.next')  # Adjust selector as needed
            if next_button:
                await next_button.click()
                await page.wait_for_timeout(1000)  # Wait for the new content to load
            else:
                break
                
        await browser.close()
        return reviews

@app.route('/api/reviews', methods=['GET'])
async def get_reviews():
    url = request.args.get('page')
    if not url:
        return jsonify({"error": "URL parameter is required"}), 400
        
    try:
        reviews = await extract_reviews(url)
        return jsonify({
            "reviews_count": len(reviews),
            "reviews": reviews
        })
    except Exception as e:
        app.logger.error(f"Error fetching reviews: {str(e)}")  # Log the error
        return jsonify({"error": str(e)}), 500

@app.route('/')
def serve_index():
    return send_from_directory('frontend', 'index.html')

@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('frontend', path)

if __name__ == '__main__':
    app.run(debug=True)