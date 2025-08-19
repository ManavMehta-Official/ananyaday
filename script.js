// Wait for the entire webpage to load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get all the elements we need to control from the HTML
    const mainTitle = document.getElementById('main-title');
    const popup = document.getElementById('popup');
    const revealLines = document.getElementById('reveal-lines');
    const puzzleContainer = document.getElementById('puzzle-container');
    const finalMessage = document.getElementById('final-message');
    const legoPlaceholder = document.getElementById('lego-placeholder');

    // --- The Main Sequence ---

    // 1. After 2 seconds, fade out the main title and show the pop-up
    setTimeout(() => {
        mainTitle.style.transition = 'opacity 1s';
        mainTitle.style.opacity = '0';

        setTimeout(() => {
            mainTitle.classList.add('hidden');
            popup.classList.remove('hidden');
            // Use a timeout to allow the element to be in the DOM before changing opacity
            setTimeout(() => popup.style.opacity = '1', 50); 
        }, 1000); // Wait for fade-out to finish
    }, 2000); // Start after 2 seconds

    // 2. When the pop-up is clicked, start the line reveal
    popup.addEventListener('click', () => {
        popup.style.transition = 'opacity 1s';
        popup.style.opacity = '0';

        setTimeout(() => {
            popup.classList.add('hidden');
            revealLines.classList.remove('hidden');
            startLineReveal();
        }, 1000); // Wait for fade-out to finish
    });

    // Function to reveal the four lines one by one
    function startLineReveal() {
        const lines = document.querySelectorAll('.line');
        let delay = 0;
    
        // --- CHANGE #1: INCREASE THE DELAY BETWEEN LINES ---
        // We'll change the increment from 600ms to 2500ms (2.5 seconds).
        // The first line appears immediately (delay=0).
        // The second appears after 2.5s, the third after 5s, etc.
        lines.forEach((line) => {
            setTimeout(() => {
                line.classList.add('slide-in');
            }, delay);
            delay += 2500; // 2500 milliseconds = 2.5 seconds
        });
    
        // --- CHANGE #2: INCREASE THE DELAY BEFORE THE FINAL REVEAL ---
        // The 'delay' variable will now hold the total time it took for all lines to appear.
        // We'll add a longer pause (3000ms = 3 seconds) after the last line slides in.
        setTimeout(() => {
            puzzleContainer.classList.remove('hidden');
            puzzleContainer.style.animation = 'fadeIn 1s forwards';
            
            // Start the letter-flying animation after another short pause
            setTimeout(flyLetters, 1000);
        }, delay + 3000); // Wait 3 seconds after the last line is on screen
    }
    // Function to make the L, E, G, O letters fly
    function flyLetters() {
        const letters = [
            { id: 'l', placeholderPos: 0 },
            { id: 'e', placeholderPos: 35 },
            { id: 'g', placeholderPos: 70 },
            { id: 'o', placeholderPos: 105 }
        ];

        letters.forEach((letterInfo, index) => {
            const sourceLetter = document.querySelector(`.letter-${letterInfo.id}`);
            const flyingLetter = document.getElementById(`fly-${letterInfo.id}`);

            // Get the starting position (where the letter is in the line)
            const sourceRect = sourceLetter.getBoundingClientRect();
            // Get the ending position (relative to the placeholder)
            const placeholderRect = legoPlaceholder.getBoundingClientRect();

            // Calculate the start and end positions for the animation
            const startX = sourceRect.left - placeholderRect.left;
            const startY = sourceRect.top - placeholderRect.top;
            const endX = letterInfo.placeholderPos;

            // Set CSS variables that the @keyframes animation will use
            flyingLetter.style.setProperty('--start-pos', `translate(${startX}px, ${startY}px)`);
            flyingLetter.style.setProperty('--end-pos', `translate(${endX}px, 0px)`);

            // Trigger the animation
            setTimeout(() => {
                sourceLetter.style.opacity = '0'; // Hide the original letter
                flyingLetter.style.animation = `flyAndSettle 1s forwards cubic-bezier(0.68, -0.55, 0.27, 1.55)`;
            }, index * 200); // Stagger the start of each letter's flight
        });

        // 5. After the letters have landed, complete the sentence
        setTimeout(() => {
            legoPlaceholder.classList.add('hidden');
            finalMessage.classList.remove('hidden');
            finalMessage.style.animation = 'fadeIn 1s forwards';
        }, (letters.length * 200) + 1000);
    }
});