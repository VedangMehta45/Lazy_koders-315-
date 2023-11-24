const questionElement = document.getElementById("question");
const answerChoice = document.getElementById("Answer-choice");
const next_button = document.getElementById("next");

let currentQindex = 0;
let score = 0;

function start_quiz() {
    currentQindex = 0;
    score = 0;
    next_button.innerHTML = "Next Question";
    fetchQuestionsFromAPI(); // Fetch questions from the API
}

function fetchQuestionsFromAPI() {
    const apiUrl = 'https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple';
    fetch(apiUrl)
        .then(response => response.json())
        .then(que => {
            QuestionSet = que.results;
            console.log(que.results);
            showQuestion();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

function showQuestion() {
    // Reset the page
    pageReset();

    // Get the current question from the API response
    let currentQuestion = QuestionSet[currentQindex];
    let quesNo = currentQindex + 1;
    questionElement.innerHTML = quesNo + ". " + currentQuestion.question;

    // Check if currentQuestion and currentQuestion.incorrect_answers are defined
    if (currentQuestion && currentQuestion.incorrect_answers) {
        // Combine correct_answer with incorrect_answers to create an array of all possible answers
        const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

        allAnswers.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = answer;
            button.classList.add("ans_opt");
            answerChoice.appendChild(button);

            // Check if the answer is the correct one
            if (answer === currentQuestion.correct_answer) {
                button.dataset.correct = true;
            }

            button.addEventListener("click", selectAnswer);
        });
    } else {
        // Handle the case where currentQuestion or currentQuestion.incorrect_answers is undefined
        console.error('Error: currentQuestion or currentQuestion.incorrect_answers is undefined');
    }
}

function pageReset() {
    next_button.style.display = "none";
    while (answerChoice.firstChild) {
        answerChoice.removeChild(answerChoice.firstChild);
    }
}

function selectAnswer(e) {
    const selected_button = e.target;
    const ISCORRECT = selected_button.dataset.correct === "true";
    if (ISCORRECT) {
        selected_button.classList.add("correct");
        score = score + 1;
    } else {
        selected_button.classList.add("wrong");
        score = score - 0.5;
    }
    Array.from(answerChoice.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    next_button.style.display = "block";
}

// function timer() {
//     document.addEventListener('DOMContentLoaded', function () {
//         // Set the timer duration in seconds
//         var timerDuration = 10;

//         // Get the countdown element
//         var countdownElement = document.getElementById('countdown');

//         // Function to update the countdown
//         function updateCountdown() {
//             countdownElement.textContent = timerDuration;
//         }

//         // Function to handle each second of the countdown
//         function countdown() {
//             if (timerDuration > 0) {
//                 timerDuration--;
//                 updateCountdown();
//             } else {
//                 // Quiz time is up, handle accordingly (e.g., show results)
//                 clearInterval(timerInterval);
//                 alert("Time's up!");
//             }
//         }

//         // Initialize the countdown
//         updateCountdown();

//         // Start the countdown timer
//         var timerInterval = setInterval(countdown, 1000);
//     });
// }

next_button.addEventListener("click", () => {
    if (currentQindex < QuestionSet.length) {
        NXTT();
    } else {
        start_quiz();
    }
});

function NXTT() {
    currentQindex++;
    if (currentQindex < QuestionSet.length) {
        showQuestion();
    } else {
        result();
    }
}

function result() {
    pageReset();
    questionElement.innerHTML = `You scored ${score} out of ${QuestionSet.length}!!`;
    next_button.style.display = "block";
}




start_quiz();