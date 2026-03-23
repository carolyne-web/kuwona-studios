// Animated text effect - handles both page load animation and viewport animation
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== boldFadeIn.js START ===');

  // Handle elements with data-animate-bold (page titles) - row-by-row bold transition on page load
  const boldBirdElements = document.querySelectorAll('[data-animate-bold]');
  console.log('Found [data-animate-bold] elements:', boldBirdElements.length);

  // Debug: log each element
  boldBirdElements.forEach(function(el, i) {
    console.log('Element ' + i + ':', el.textContent.substring(0, 30));
  });

  if (boldBirdElements.length > 0) {
    // Start elements at font-weight 300 (they should already be there, but force it)
    boldBirdElements.forEach(function(bird) {
      console.log('Initial font-weight:', window.getComputedStyle(bird).fontWeight);
      bird.style.fontWeight = '300'; // Ensure starting at 300
    });

    // Force browser reflow/repaint
    void boldBirdElements[0].offsetHeight;

    // Group elements by rows based on their Y position
    function groupByRows(elements) {
      const rows = [];
      const tolerance = 10; // pixels tolerance for same row detection

      elements.forEach(function(element) {
        const rect = element.getBoundingClientRect();
        const top = rect.top;

        // Find if this element belongs to an existing row
        let foundRow = false;
        for (let i = 0; i < rows.length; i++) {
          if (Math.abs(rows[i].top - top) < tolerance) {
            rows[i].elements.push(element);
            foundRow = true;
            break;
          }
        }

        // Create new row if not found
        if (!foundRow) {
          rows.push({
            top: top,
            elements: [element]
          });
        }
      });

      // Sort rows by top position
      rows.sort(function(a, b) {
        return a.top - b.top;
      });

      return rows;
    }

    // Animate rows sequentially - just add 'bold' class to transition font-weight
    const rows = groupByRows(Array.from(boldBirdElements));
    console.log('Created ' + rows.length + ' rows');
    const delayBetweenRows = 800; // ms delay between rows
    const initialDelay = 500; // Delay before starting animation

    rows.forEach(function(row, index) {
      console.log('Row ' + index + ' scheduled for ' + (initialDelay + index * delayBetweenRows) + 'ms, contains ' + row.elements.length + ' elements');
      setTimeout(function() {
        console.log('Animating row ' + index + ' NOW');
        row.elements.forEach(function(element) {
          console.log('Making bold:', element.textContent.substring(0, 20));
          console.log('Font-weight BEFORE:', window.getComputedStyle(element).fontWeight);
          element.style.fontWeight = '500'; // Transition to 500
          console.log('Font-weight AFTER:', window.getComputedStyle(element).fontWeight);
        });
      }, initialDelay + (index * delayBetweenRows));
    });
  }

  console.log('=== boldFadeIn.js COMPLETE ===');

  // Handle .bird elements (homepage) - viewport-triggered animation
  const birdOnlyElements = document.querySelectorAll('.bird:not(.bold)');

  if (birdOnlyElements.length > 0) {
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      // Check if at least part of the element is visible
      return (
        rect.top < windowHeight &&
        rect.bottom > 0 &&
        rect.left < windowWidth &&
        rect.right > 0
      );
    }

    function handleVisibility() {
      birdOnlyElements.forEach(function(bird) {
        if (isInViewport(bird) && !bird.classList.contains('bold')) {
          bird.classList.add('bold');
        }
      });
    }

    // Initial check on page load with slight delay to ensure layout is complete
    setTimeout(handleVisibility, 100);

    // Listen for scroll and resize events
    window.addEventListener('scroll', handleVisibility);
    window.addEventListener('resize', handleVisibility);
  }
});
