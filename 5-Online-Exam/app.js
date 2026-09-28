const examDurationSeconds = 120; // 2 minutes
const questions = [
    {
        id: 1,
        question: "Which programming language is known as the 'scripting language for the Web'?",
        options: ["Java", "Python", "JavaScript", "C++"],
        correct: 2 // Index matching JavaScript
    },
    {
        id: 2,
        question: "What does DOM stand for in web development?",
        options: ["Document Object Model", "Data Object Monitor", "Digital Ordinance Matrix", "Desktop Online Menu"],
        correct: 0
    },
    {
        id: 3,
        question: "Which HTML5 element is used to embed standalone audio streams?",
        options: ["embed", "sound", "video", "audio"],
        correct: 3
    }
];

let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(null); // Keeps track of responses
let timeLeft = examDurationSeconds;
let timerInterval = null;

const qNumber = document.getElementById("q-number");
const qText = document.getElementById("q-text");
const optionsBox = document.getElementById("options-box");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const timerDisplay = document.getElementById("timer");

function initPortal() {
    renderQuestion();
    startTimer();
}

function renderQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    
    qNumber.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    qText.innerText = currentQuestion.question;
    optionsBox.innerHTML = ""; // Wipe previous entries

    currentQuestion.options.forEach((option, idx) => {
        const isSelected = userAnswers[currentQuestionIndex] === idx;
        
        const label = document.createElement("label");
        label.className = `option-label ${isSelected ? 'selected' : ''}`;
        
        label.innerHTML = `
            <input type="radio" name="quiz-option" value="${idx}" ${isSelected ? 'checked' : ''} onchange="selectOption(${idx})">
            ${option}
        `;
        optionsBox.appendChild(label);
    });

    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.classList.add("hidden");
        submitBtn.classList.remove("hidden");
    } else {
        nextBtn.classList.remove("hidden");
        submitBtn.classList.add("hidden");
    }
}

window.selectOption = function(index) {
    userAnswers[currentQuestionIndex] = index;
    
    // Visually update current choices
    const labels = optionsBox.querySelectorAll(".option-label");
    labels.forEach((lbl, idx) => {
        if (idx === index) lbl.classList.add("selected");
        else lbl.classList.remove("selected");
    });
};

window.changeQuestion = function(direction) {
    currentQuestionIndex += direction;
    renderQuestion();
};


function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        
        // Format layout to MM:SS
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerDisplay.innerText = `${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Your exam will be submitted automatically.");
            gradeExam(false);
        }
    }, 1000);
}

window.gradeExam = function(userPrompted) {
    if (userPrompted && !confirm("Are you sure you want to finalize your submission?")) {
        return;
    }
    
    clearInterval(timerInterval); // Stop ticking

    let correctCount = 0;
    questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correct) {
            correctCount++;
        }
    });

    const finalPercentage = Math.round((correctCount / questions.length) * 100);
    
    // Hide Portal Frame and render Results Card
    document.getElementById("exam-container").classList.add("hidden");
    const resultBox = document.getElementById("result-container");
    resultBox.classList.remove("hidden");

    document.getElementById("res-total").innerText = questions.length;
    document.getElementById("res-correct").innerText = correctCount;
    document.getElementById("res-score").innerText = `${finalPercentage}%`;
    
    const statusText = document.getElementById("res-status");
    if (finalPercentage >= 70) {
        statusText.innerText = "PASS";
        statusText.style.color = "var(--success)";
    } else {
        statusText.innerText = "FAIL";
        statusText.style.color = "var(--danger)";
    }
};

window.onload = initPortal;
