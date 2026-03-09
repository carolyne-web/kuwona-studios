// Newsletter Form Submission Handler
document.addEventListener('DOMContentLoaded', function() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxbg_hHFsVsMGtEIcRboJ4cu3dnCa-N_iTY7XdwuOgz12allun4BYqs5vuXLYgidOdP2A/exec';
  const form = document.querySelector('form[name="newsletter-form"]');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);

      // Submit to Google Apps Script
      fetch(scriptURL, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        alert("Thank you! Submitted successfully.");
        form.reset();
      })
      .catch(error => {
        console.error('Error!', error.message);
        alert("Sorry, there was an error submitting your information. Please try again.");
      });
    });
  }
});
