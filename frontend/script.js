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
        throw new Error("Network response was not ok");
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
