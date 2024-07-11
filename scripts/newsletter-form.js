
const scriptURL = 'https://script.google.com/macros/s/AKfycbxbg_hHFsVsMGtEIcRboJ4cu3dnCa-N_iTY7XdwuOgz12allun4BYqs5vuXLYgidOdP2A/exec'

const form = document.forms['newsletter-form']

form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(response => alert("thank you! submitted successfully." ))
  .then(() => { window.location.reload(); })
  .catch(error => console.error('Error!', error.message))
})
