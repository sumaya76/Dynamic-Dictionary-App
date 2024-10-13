// Select elements from the DOM
const inputEl = document.getElementById("input");
const infoTextEl = document.getElementById("info-text");
const meaningContainerEl = document.getElementById("meaning-container");
const titleEl = document.getElementById("title");
const partOfSpeechEl = document.getElementById("part-of-speech");
const meaningEl = document.getElementById("meaning");
const synonymsEl = document.getElementById("synonyms");
const antonymsEl = document.getElementById("antonyms");
const audioEl = document.getElementById("audio");

// Add event listener for input
inputEl.addEventListener("keypress", function(event) {
  // Check if the enter key is pressed
  if (event.key === "Enter") {
    const word = inputEl.value.trim();
    if (word) {
      fetchAPI(word); // Call the fetchAPI function with the entered word
    }
  }
});

// Function to fetch and display the word details
async function fetchAPI(word) {
  try {
    // Show a message while fetching
    infoTextEl.style.display = "block";
    meaningContainerEl.style.display = "none"; // Hide meaning container initially
    infoTextEl.innerText = `Searching the meaning of "${word}"...`;

    // Fetch data from the dictionary API
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const result = await fetch(url).then((res) => res.json());

    // Check if the word is found
    if (result.title) {
      // If the word is not found, show the meaning container with 'Not available'
      meaningContainerEl.style.display = "block";
      infoTextEl.style.display = "none"; // Hide info text
      titleEl.innerText = word;
      partOfSpeechEl.innerText = "Not available";
      meaningEl.innerText = "Not available";
      synonymsEl.innerText = "Not available";
      antonymsEl.innerText = "Not available";
      audioEl.style.display = "none"; // Hide audio if not found
    } else {
      // Word found: Update the meaning container with actual data
      infoTextEl.style.display = "none"; // Hide info text
      meaningContainerEl.style.display = "block"; // Make meaning container visible

      titleEl.innerText = result[0].word; // Set word title
      partOfSpeechEl.innerText = result[0].meanings[0].partOfSpeech || "Not available"; // Set part of speech
      meaningEl.innerText = result[0].meanings[0].definitions[0].definition; // Set meaning

      // Handle synonyms
      const synonyms = result[0].meanings[0].synonyms.length > 0
        ? result[0].meanings[0].synonyms.join(', ')
        : "Not available";
      synonymsEl.innerText = synonyms; // Set synonyms

      // Handle antonyms
      const antonyms = result[0].meanings[0].antonyms.length > 0
        ? result[0].meanings[0].antonyms.join(', ')
        : "Not available";
      antonymsEl.innerText = antonyms; // Set antonyms

      // Handle pronunciation audio
      if (result[0].phonetics[0] && result[0].phonetics[0].audio) {
        audioEl.src = result[0].phonetics[0].audio; // Set audio source
        audioEl.style.display = "inline-flex"; // Make the audio player visible
      } else {
        audioEl.style.display = "none"; // Hide audio player if not available
      }

      // Add text-to-speech for each section with structured phrases
      readOutLoud(`Word: ${result[0].word}`); // Speak word title
      readOutLoud(`Part of speech: ${result[0].meanings[0].partOfSpeech || "Not available"}`); // Speak part of speech
      readOutLoud(`Meaning: ${result[0].meanings[0].definitions[0].definition}`); // Speak meaning
      readOutLoud(`Synonyms: ${synonyms}`); // Speak synonyms
      readOutLoud(`Antonyms: ${antonyms}`); // Speak antonyms
    }
  } catch (error) {
    console.error("Error:", error);
    infoTextEl.innerText = `An error occurred, please try again later.`;
  }
}

// Function to handle text-to-speech using the SpeechSynthesis API
function readOutLoud(text) {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  } else {
    console.error('Text-to-speech is not supported in this browser.');
  }
}
