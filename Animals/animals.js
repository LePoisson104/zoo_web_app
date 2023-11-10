const seeDetailsButtons = document.querySelectorAll(".card-button");

seeDetailsButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    const detailsPageURL = this.getAttribute("href");
    window.open(detailsPageURL, "_blank");
  });
});

// Open the respective pop-up when an animal card is clicked
const animalCards = document.querySelectorAll('.animal-card');
const popups = document.querySelectorAll('.popup');

animalCards.forEach((card, index) => {
  card.addEventListener('click', () => {
    popups[index].style.display = 'block';
  });
});

// Close the pop-up when the close button is clicked
const closeBtns = document.querySelectorAll('.close');

closeBtns.forEach((closeBtn, index) => {
  closeBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent any default link behavior
    popups[index].style.display = 'none';
  });
});