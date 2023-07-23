let cards = [
    {
      front: "videos/nice to meet you.mp4",
      back: "Nice to meet you"
    },
    {
      front: "videos/how are you.mp4",
      back: "How are you?"
    },
    {
      front: "videos/names.mp4",
      back: "My name is..."
    }
  ];
 
  let currentCard = 1,
    carousel = document.querySelector(".carousel"),
    next = document.querySelector(".next"),
    prev = document.querySelector(".prev");
 
  renderCards();
 
  function renderCards() {
    carousel.style.width = `${cards.length}00vw`;
    cards.map(el => {
      let div = document.createElement("div");
      div.classList.add("card");
      let front = document.createElement("div");
      front.classList.add("front");
      let back = document.createElement("div");
      back.classList.add("back");
      let videoContainer = document.createElement("div");
        videoContainer.classList.add("video-container");

        // Create and append video element to the video container
        let video = document.createElement("video");


        video.src = el.front;
        video.controls = true;
        video.height = 200; // in px
        video.width = 350; // in px
        videoContainer.appendChild(video);


        // front.appendChild(videoContainer);
      back.textContent = el.back;
      div.appendChild(video);
      div.appendChild(back);
      div.addEventListener("click", function(e) {
        e.srcElement.parentNode.classList.toggle("active");
      });
      carousel.appendChild(div);
    });
  }
 
  next.addEventListener("click", function(e) {
    if (currentCard >= cards.length) {
      return;
    }
    currentCard++;
    cardFly();
  });
 
  prev.addEventListener("click", function(e) {
    if (currentCard - 1 <= 0) {
      return;
    }
    currentCard--;
    cardFly();
  });
 
  function cardFly() {
    carousel.style.transform = `translateX(-${currentCard - 1}00vw)`;
  }
 



/* nav bar */

(function($) { // Begin jQuery
  $(function() { // DOM ready
    // If a link has a dropdown, add sub menu toggle.
    $('nav ul li a:not(:only-child)').click(function(e) {
      $(this).siblings('.nav-dropdown').toggle();
      // Close one dropdown when selecting another
      $('.nav-dropdown').not($(this).siblings()).hide();
      e.stopPropagation();
    });
    // Clicking away from dropdown will remove the dropdown class
    $('html').click(function() {
      $('.nav-dropdown').hide();
    });
    // Toggle open and close nav styles on click
    $('#nav-toggle').click(function() {
      $('nav ul').slideToggle();
    });
    // Hamburger to X toggle
    $('#nav-toggle').on('click', function() {
      this.classList.toggle('active');
    });
  }); // end DOM ready
})(jQuery); // end jQuery