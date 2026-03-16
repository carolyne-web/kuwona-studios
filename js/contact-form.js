// Contact form submission handler
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitButton = contactForm.querySelector('.contact-submit-button');
      const buttonText = submitButton.querySelector('.button-text');
      const buttonSending = submitButton.querySelector('.button-sending');
      const buttonSuccess = submitButton.querySelector('.button-success');

      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        hearAbout: document.getElementById('hear-about').value,
        message: document.getElementById('message').value,
        newsletter: document.querySelector('input[name="newsletter"]').checked
      };

      // Update button state to "sending"
      buttonText.style.display = 'none';
      buttonSending.style.display = 'inline';
      submitButton.disabled = true;

      try {
        // Send to Vercel serverless function
        const response = await fetch('https://kuwona-studios.vercel.app/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          // Success state
          buttonSending.style.display = 'none';
          buttonSuccess.style.display = 'inline';

          // Reset form after delay
          setTimeout(function() {
            contactForm.reset();
            buttonSuccess.style.display = 'none';
            buttonText.style.display = 'inline';
            submitButton.disabled = false;
          }, 3000);
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an error sending your message. Please try emailing us directly at info@kuwonastudios.com');

        // Reset button state
        buttonSending.style.display = 'none';
        buttonText.style.display = 'inline';
        submitButton.disabled = false;
      }
    });
  }
});
