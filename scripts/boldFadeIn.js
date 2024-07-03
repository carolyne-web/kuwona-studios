// document.addEventListener('DOMContentLoaded', function() {
// const birdElements = document.querySelectorAll('.bird');

//   function isInViewport(element) {
//     const rect = element.getBoundingClientRect();
//     return (
//       rect.top >= 0 &&
//       rect.left >= 0 &&
//       rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//       rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//     );
//   }

//   function handleVisibility() {
//     birdElements.forEach(function(bird) {
//       if (isInViewport(bird) && !bird.classList.contains('bold')) {
//         bird.style.transition = 'font-weight 3s ease'; // Apply transition when becoming bold
//         bird.style.fontWeight = '500'; // Immediately change to bold
//         setTimeout(function() {
//           bird.classList.add('bold');
//         }, 1000); // Delay adding the 'bold' class
//       }
//     });
//   }

//   // Initial check on page load
//   handleVisibility();

//   // Listen for scroll and resize events
//   window.addEventListener('scroll', handleVisibility);
//   window.addEventListener('resize', handleVisibility);
// });
document.addEventListener('DOMContentLoaded', function() {
  const birdElements = document.querySelectorAll('.bird');

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function handleVisibility() {
    birdElements.forEach(function(bird) {
      if (isInViewport(bird) && !bird.classList.contains('bold')) {
        bird.classList.add('bold');
      }
    });
  }

  // Initial check on page load
  handleVisibility();

  // Listen for scroll and resize events
  window.addEventListener('scroll', handleVisibility);
  window.addEventListener('resize', handleVisibility);
});
