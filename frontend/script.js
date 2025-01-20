document
  .getElementById("fetchReviewsBtn")
  .addEventListener("click", async () => {
    const url = document.getElementById("urlInput").value.trim();

    if (!url) {
      alert("Please enter a valid URL.");
      return;
    }

    const reviewsContainer = document.getElementById("reviewsContainer");
    reviewsContainer.innerHTML = ""; // Clear previous results

    try {
      const response = await fetch(
        `/api/reviews?page=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error(" Openai: You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.");
      }

      const data = await response.json();

      if (data.error) {
        reviewsContainer.innerHTML = `<p>Error: ${data.error}</p>`;
        return;
      }

      const reviews = data.reviews;

      if (reviews.length === 0) {
        reviewsContainer.innerHTML = "<p>No reviews found.</p>";
        return;
      }

      reviews.forEach((review) => {
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("review");
        reviewDiv.innerHTML = `
                <h3>${review.title}</h3>
                <p>${review.body}</p>
                <strong>Rating: ${review.rating}</strong><br>
                <em>Reviewed by ${review.reviewer}</em>
            `;
        reviewsContainer.appendChild(reviewDiv);
      });
    } catch (error) {
      reviewsContainer.innerHTML = `<p>Error fetching reviews: ${error.message}</p>`;
    }
  });
