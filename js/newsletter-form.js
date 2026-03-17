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
          // Show success message
          const successMsg = document.createElement('div');
          successMsg.className = 'newsletter-success';
          successMsg.textContent = "you're in! check your inbox for confirmation.";
          form.parentNode.insertBefore(successMsg, form.nextSibling);

          form.reset();

          // Remove success message after 5 seconds
          setTimeout(() => {
            successMsg.remove();
          }, 5000);
        } else {
          const errorData = await response.json();
          console.error('Subscription error details:', errorData);
          throw new Error(errorData.details || 'Failed to subscribe');
        }
      } catch (error) {
        console.error('Error!', error.message);

        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'newsletter-error';
        errorMsg.textContent = "oops, something went wrong. please try again.";
        form.parentNode.insertBefore(errorMsg, form.nextSibling);

        // Remove error message after 5 seconds
        setTimeout(() => {
          errorMsg.remove();
        }, 5000);
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }
});
