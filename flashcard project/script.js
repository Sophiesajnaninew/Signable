const request = window.indexedDB.open("video_flashcards", 1);


let db;
request.onerror = (event) => {
  console.error("Error opening IndexedDB", event.target.error);
};


request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore("video_flashcards", { keyPath: "id", autoIncrement: true });
};


request.onsuccess = (event) => {
  db = event.target.result;


  // Check if 'items' exists in IndexedDB, and if not, initialize it as an empty array
  const transaction = db.transaction(["video_flashcards"], "readwrite");
  const objectStore = transaction.objectStore("video_flashcards");
  const getItemsRequest = objectStore.getAll();


  getItemsRequest.onsuccess = (event) => {
    const contentArray = event.target.result || [];
    contentArray.forEach(flashcardMaker);
  };
};


// Function to create flashcards with video
function flashcardMaker(items, delThisIndex) {
  const flashcard = document.createElement("div");
  const frontSide = document.createElement("div");
  const backSide = document.createElement("div");
  const backContent = document.createElement("div"); // New div for backside content
  const question = document.createElement('h2');
  const answer = document.createElement('h2');
  const del = document.createElement('i');
  const fileInput = document.createElement('input');
  const frontVideo = document.createElement('video');
  const backVideo = document.createElement('video');


  flashcard.className = 'flashcard';
  frontSide.className = 'front-side';
  backSide.className = 'back-side';


  question.setAttribute("style", "padding: 15px; margin-top:30px");
  question.textContent = items.my_question;


  answer.setAttribute("style", "text-align:center; display:none; color:red");
  answer.textContent = items.my_answer;


  del.className = "fas fa-minus";
  del.addEventListener("mousedown", (event) => {
    event.stopPropagation(); // Stop the click event from propagating to the flashcard
    const transaction = db.transaction(["video_flashcards"], "readwrite");
    const objectStore = transaction.objectStore("video_flashcards");
    const deleteRequest = objectStore.delete(delThisIndex);
    deleteRequest.onsuccess = () => {
      // Remove the flashcard element from the DOM
      const flashcardsContainer = document.querySelector("#flashcards");
      flashcardsContainer.removeChild(flashcard);
    };
    deleteRequest.onerror = (event) => {
      console.error("Error deleting flashcard from IndexedDB", event.target.error);
    };
  });


  // Check if video URL is already set for the flashcard
  if (items.video_url) {
    fileInput.style.display = "none"; // Hide the file input if the video URL exists
  }


  fileInput.type = "file";
  fileInput.accept = "video/*";
  fileInput.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent click event propagation to the flashcard
  });
  fileInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      items.video_url = selectedFile;


      const reader = new FileReader();
      reader.onload = function () {
        items.video_blob = reader.result; // Store the Blob itself
        const transaction = db.transaction(["video_flashcards"], "readwrite");
        const objectStore = transaction.objectStore("video_flashcards");
        const putRequest = objectStore.put(items);
        putRequest.onerror = (event) => {
          console.error("Error updating flashcard in IndexedDB", event.target.error);
        };
        // Set the video source immediately
        frontVideo.src = items.video_blob; // Update the video on the front side


        // Show the video element on the front side
        frontVideo.style.display = "block";


        // Remove the file input element from the flashcard
        frontSide.removeChild(fileInput);
      };
      reader.readAsDataURL(selectedFile);
    }
  });


  frontVideo.controls = true;
  frontVideo.muted = false;
  frontVideo.height = 140; // in px
  frontVideo.width = 250; // in px


  // If video Blob exists in 'items', set the video source from Blob on the front side
  if (items.video_blob) {
    // Set the video_blob as a new Blob for the front video source
    const frontVideoSource = new Blob([items.video_blob], { type: 'video/mp4' });
    frontVideo.src = URL.createObjectURL(frontVideoSource);


    // Show the video element on the front side
    frontVideo.style.display = "block";
  } else {
    // If no video Blob exists, hide the video element on the front side
    frontVideo.style.display = "none";
  }

  // Hide the video element on the back side initially
  backVideo.style.display = "none";


  // Append elements to their respective sides
  // Create a new input element with type="text"
  const newInput = document.createElement("textarea");
  newInput.setAttribute("type", "text");


  newInput.removeAttribute("style");


  // Set attributes and properties for the input field (optional)
  newInput.setAttribute("id", "myInput"); // Set the id attribute for the input field
  newInput.setAttribute("placeholder", "Enter text here"); // Set a placeholder text (optional)
  newInput.setAttribute("class", "my-input-class"); // Set a CSS class for styling (optional)
  newInput.setAttribute("style", "text-align:center; display:none; color:red");
  newInput.setAttribute("style", "padding: 15px; margin-top:30px");


  newInput.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent click event propagation to the flashcard
  });

  newInput.style.height = "150px";
  newInput.style.width = "300px";

  newInput.style.resize = "none";

  frontSide.appendChild(fileInput);
  frontSide.appendChild(del);
  frontSide.appendChild(frontVideo); // Add the video element to the front side


  backContent.appendChild(newInput);
  backContent.appendChild(answer);
  backContent.appendChild(backVideo); // Add the video element to the back side
  backContent.style.display = "flex";
  backSide.appendChild(backContent); // Add backContent div to the back side


  newInput.style.display = "none";


  // Flashcard flip:
  // Flashcard flip:
  let isFlipped = false;
  flashcard.addEventListener("click", () => {
    isFlipped = !isFlipped;
    if (isFlipped) {
      frontSide.style.display = "none";
      backSide.style.display = "block";
      backSide.appendChild(del);
      newInput.style.display = "block";
    } else {
      frontSide.style.display = "block";
      backSide.style.display = "none";
      frontSide.appendChild(del);
      newInput.style.display = "none";
    }
  });


  flashcard.appendChild(frontSide);
  flashcard.appendChild(backSide);


  document.querySelector("#flashcards").appendChild(flashcard);
}


// Function to add a flashcard with video
function addFlashcard() {
  const flashcard_info = {
    'video_blob': null, // Initially set to null
    'my_question': '', // Change 'my_text' to 'my_question'
    'my_answer': '' // Add 'my_answer' property for flashcard content
  };


  // Save new flashcard to IndexedDB
  const transaction = db.transaction(["video_flashcards"], "readwrite");
  const objectStore = transaction.objectStore("video_flashcards");
  const putRequest = objectStore.add(flashcard_info);
  putRequest.onerror = (event) => {
    console.error("Error adding flashcard to IndexedDB", event.target.error);
  };
  putRequest.onsuccess = (event) => {
    flashcardMaker(flashcard_info, event.target.result);
  };
}


// Event listeners
document.getElementById("save_card").addEventListener("click", () => {
  addFlashcard();
});


document.getElementById("delete_cards").addEventListener("click", () => {
  const transaction = db.transaction(["video_flashcards"], "readwrite");
  const objectStore = transaction.objectStore("video_flashcards");
  const clearRequest = objectStore.clear();


  clearRequest.onsuccess = () => {
    document.getElementById('flashcards').innerHTML = '';
  };


  clearRequest.onerror = (event) => {
    console.error("Error deleting flashcards from IndexedDB", event.target.error);
  };
});




window.addEventListener("beforeunload", () => {
  const transaction = db.transaction(["video_flashcards"], "readwrite");
  const objectStore = transaction.objectStore("video_flashcards");
  const clearRequest = objectStore.clear();


  clearRequest.onsuccess = () => {
    document.getElementById('flashcards').innerHTML = '';
  };


  clearRequest.onerror = (event) => {
    console.error("Error deleting flashcards from IndexedDB", event.target.error);
  };
});

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;


  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }


  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }


  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}


function createBlankTabButton() {
  const button = document.createElement("button");
  button.textContent = "American Sign Language I";
  button.addEventListener("click", () => {
    openCity(event, "Blank"); // Assuming the ID of the "Blank" tab is "Blank"
  });

  // Add the button to the "Learn" tab
  const learnTab = document.getElementById("Learn"); // Assuming the ID of the "Learn" tab is "Learn"
  learnTab.appendChild(button);
}

// Call the function to create the button
createBlankTabButton();

function createBlankTabButton1() {
  const button = document.createElement("button");
  button.textContent = "American Sign Language II";
  button.addEventListener("click", () => {
    openCity(event, "Blank1"); // Assuming the ID of the "Blank" tab is "Blank"
  });

  // Add the button to the "Learn" tab
  const learnTab = document.getElementById("Learn"); // Assuming the ID of the "Learn" tab is "Learn"
  learnTab.appendChild(button);
}

// Call the function to create the button
createBlankTabButton1();

function createBlankTabButton2() {
  const button = document.createElement("button");
  button.textContent = "American Sign Language III";
  button.addEventListener("click", () => {
    openCity(event, "Blank2"); // Assuming the ID of the "Blank" tab is "Blank"
  });

  // Add the button to the "Learn" tab
  const learnTab = document.getElementById("Learn"); // Assuming the ID of the "Learn" tab is "Learn"
  learnTab.appendChild(button);
}

// Call the function to create the button
createBlankTabButton2();

// nav bar: 
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
