// Newsletter Form Submission Handler
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form[name="newsletter-form"]');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Get form data
      const name = form.querySelector('input[name="your-name"]').value;
      const email = form.querySelector('input[name="your-email"]').value;

      // Disable submit button
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '...';

      try {
        // Submit to Klaviyo via our API
        const response = await fetch('https://kuwona-studios.vercel.app/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email })
        });

        if (response.ok) {
          alert("Thank you! You've been subscribed to our newsletter.");
          form.reset();
        } else {
          throw new Error('Failed to subscribe');
        }
      } catch (error) {
        console.error('Error!', error.message);
        alert("Sorry, there was an error. Please try again.");
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }
});
