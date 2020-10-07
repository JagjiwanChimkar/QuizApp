const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');

const loader = document.getElementById('loader');
const loaderContainer = document.getElementById('loader-container');

const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let timer;
let timerInstance;
let questions = [];


fetch(
        'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
    ).then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    loaderContainer.remove()
    game.classList.remove('hidden');
    setTimeout(() => {
        updateProgressBar()
    }, 0);
};

startTimer = () => {
    return setInterval(() => {
        if (timer > 0) {
            timer--;
            document.querySelector('.hud-timer .hud-time-remain').innerHTML = timer;
        } else{
            getNewQuestion();
        }
    }, 1000);
}

updateProgressBar = () => {
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`
}

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        // go to the end page
        const endLink = document.getElementById('endpageLink')
        endLink.click()
        return
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    // needs to animate after DOM loads...
    if (questionCounter > 1) {
        updateProgressBar()
    }

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    document.querySelector('.hud-timer .hud-time-remain').innerHTML = "20";
    timer = 20;
    clearInterval(timerInstance);
    timerInstance = startTimer();
    acceptingAnswers = true;

};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

         var i = currentQuestion.answer;
         var ans = document.querySelector(`[data-number="${i}"]`);


        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        ans.parentElement.classList.add("correct");

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            ans.parentElement.classList.remove("correct");
            getNewQuestion();

        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};