const images = [
    'image1.png', // Replace with your image paths
    'image2.png',
    // 'image3.jpg',
    // Add more images as needed
];

let currentIndex = 0;

const sliderImage = document.getElementById('sliderImage');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Initialize slider with the first image
function updateImage() {
    sliderImage.src = images[currentIndex];
}

// Button click event listeners
leftBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    updateImage();
});

rightBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    updateImage();
});

// Set the initial image
updateImage();
