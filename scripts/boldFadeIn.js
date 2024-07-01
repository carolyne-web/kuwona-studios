document.addEventListener('DOMContentLoaded', function() {
  const birdElements = document.querySelectorAll('.bird');
  let index = 0;

  function transformNextWord() {
    if (index < birdElements.length) {
      const currentBird = birdElements[index];
      currentBird.style.transition = 'font-weight 0.5s ease';
      currentBird.style.fontWeight = '500';
      currentBird.classList.add('bold');
      index++;
    }
  }

  // Initial transformation
  transformNextWord();

  // Transform words sequentially every 1 second (adjust as needed)
  setInterval(transformNextWord, 1000); // 1000ms = 1 second
});





// document.addEventListener('DOMContentLoaded', function() {
//   const birdElements = document.querySelectorAll('.bird');

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
//         }, 1000 * index); // Delay adding the 'bold' class
//       }
//     });
//   }

//   // Initial check on page load
//   handleVisibility();

//   // Listen for scroll and resize events
//   window.addEventListener('scroll', handleVisibility);
//   window.addEventListener('resize', handleVisibility);
// });
