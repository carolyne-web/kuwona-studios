document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent default form submission
      var name = document.querySelector('input[name="entry.325864919"]').value;
      var email = document.querySelector('input[name="entry.49786195"]').value;

      var formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSddLvrgOHdpKCJFK4V0UQWjwx2Ffq0vs5N3qb5JTGjGz87diQ/formResponse';

      var formData = new FormData();
      formData.append('entry.325864919', name);
      formData.append('entry.49786195', email);

      fetch(formUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      }).then(function() {
        alert('Thank you for signing up!');
        document.getElementById('newsletterForm').reset();
      }).catch(function(error) {
        console.error('Error!', error.message);
      });
    });
  } else {
    console.error('Form element not found.');
  }
});

