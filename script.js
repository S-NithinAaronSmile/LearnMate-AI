console.log("script.js loaded");

const themeToggleButton = document.getElementById("theme-toggle");

// 1. Check saved preference when the page loads
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
}

// 2. Toggle theme on click, and save the new preference
themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");

    if (isDark) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

const form = document.querySelector("#study-form form");
const topicInput = document.getElementById("topic");
const difficultySelect = document.getElementById("difficulty");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const topic = topicInput.value.trim();

    if (topic === "") {
        alert("Please enter a study topic before generating notes.");
        topicInput.focus();
        return;
    }

    showLoadingState();

    // Simulate an API delay
    generateNotesWithAI(topic, difficultySelect.value);
});

function showLoadingState() {
    document.getElementById("explanation-content").innerHTML = `
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
    `;

    document.getElementById("keypoints-content").innerHTML = `
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
    `;

    document.getElementById("summary-content").innerHTML = `
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
    `;

    document.getElementById("quiz-content").innerHTML = `
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
    `;

    document.getElementById("answers-content").innerHTML = `
        <div class="skeleton skeleton-text short"></div>
    `;
}

function displayMockResults(topic, difficulty) {

    document.getElementById("explanation-content").innerHTML = `
        <p>${topic} is a ${difficulty.toLowerCase()}-level concept commonly covered in this subject.
        This is placeholder text that will later be replaced by a real AI-generated explanation.</p>
    `;

    document.getElementById("keypoints-content").innerHTML = `
        <ul>
            <li>Key point 1 about ${topic}</li>
            <li>Key point 2 about ${topic}</li>
            <li>Key point 3 about ${topic}</li>
        </ul>
    `;

    document.getElementById("summary-content").innerHTML = `
        <p>In summary, ${topic} is an important ${difficulty.toLowerCase()}-level topic worth reviewing before exams.</p>
    `;

    document.getElementById("quiz-content").innerHTML = `
        <p>1. What is the main idea behind ${topic}?</p>
        <p>2. Why is ${topic} important in this context?</p>
    `;

    document.getElementById("answers-content").innerHTML = `
        <p>1. Sample answer placeholder.</p>
        <p>2. Sample answer placeholder.</p>
    `;
}

function showError(message) {
    const errorBox = document.getElementById("error-message");
    errorBox.textContent = message;
    errorBox.style.display = "block";

    // Clear out the skeletons so they don't sit there forever
    document.getElementById("explanation-content").innerHTML = "";
    document.getElementById("keypoints-content").innerHTML = "";
    document.getElementById("summary-content").innerHTML = "";
    document.getElementById("quiz-content").innerHTML = "";
    document.getElementById("answers-content").innerHTML = "";
}

function hideError() {
    const errorBox = document.getElementById("error-message");
    errorBox.style.display = "none";
    errorBox.textContent = "";
}
async function generateNotesWithAI(topic, difficulty) {

    const prompt = `
You are a study assistant. Generate study notes for the topic "${topic}" at a ${difficulty} level.

Respond ONLY with valid JSON in exactly this structure, and nothing else (no markdown, no code fences, no extra text):

{
  "explanation": "A clear paragraph explaining the topic.",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "summary": "A short summary paragraph.",
  "quiz": ["question 1", "question 2"],
  "answers": ["answer 1", "answer 2"]
}
`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            throw new Error("API request failed with status " + response.status);
        }

        const data = await response.json();

        const rawText = data.candidates[0].content.parts[0].text;

        // Gemini sometimes wraps JSON in ```json ... ``` — strip that if present
        const cleanedText = rawText.replace(/```json|```/g, "").trim();

        const parsedNotes = JSON.parse(cleanedText);

        hideError();
        displayRealResults(parsedNotes, topic);

    } catch (error) {
        console.error("AI generation failed:", error);

        if (error.message.includes("429")) {
            showError("Since i am running this api model using a free plan,Too many requests right now. Please wait a moment and try again.");
        } else {
            showError("Something went wrong while generating your notes. Please try again.");
        }
    }
}

function displayRealResults(notes, topic) {

    document.getElementById("explanation-content").innerHTML = `
        <p>${notes.explanation}</p>
    `;

    document.getElementById("keypoints-content").innerHTML = `
        <ul>
            ${notes.keyPoints.map(point => `<li>${point}</li>`).join("")}
        </ul>
    `;

    document.getElementById("summary-content").innerHTML = `
        <p>${notes.summary}</p>
    `;

    document.getElementById("quiz-content").innerHTML = `
        ${notes.quiz.map((q, i) => `<p>${i + 1}. ${q}</p>`).join("")}
    `;

    document.getElementById("answers-content").innerHTML = `
        ${notes.answers.map((a, i) => `<p>${i + 1}. ${a}</p>`).join("")}
    `;
}