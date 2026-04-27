const startButton = document.getElementById('start_button')
const nextButton = document.getElementById('next_button')
const questionContainerElement = document.getElementById('questions_box')
const questionElement = document.getElementById('questions')
const answerButtonsElement = document.getElementById('answer_buttons')

let shuffledQuestions, currentQuestionIndex

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

function startGame() {
    startButton.classList.add('hide')
    startButton.innerText = 'start'
    questionContainerElement.classList.remove('hide')
    fetchQuestions()
}

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        const data = await response.json()



        
        shuffledQuestions = data.results.map(question => {
            let correctAns = { text: decodeHTML(question.correct_answer), correct: true }
            let incorrectAns = question.incorrect_answers.map(answer => {
                return { text: decodeHTML(answer), correct: false }
            })

            let allAnswers = [correctAns, ...incorrectAns]

            return {
                question: decodeHTML(question.question),
                answers: shuffleAnswers(allAnswers)
            }
        })

        currentQuestionIndex = 0
        setNextQuestion()
    } catch (error) {
        alert('Failed to fetch questions. Please check your internet connection.')
        startButton.classList.remove('hide')
    }
}


function decodeHTML(html) {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
}

function shuffleAnswers(answers) {

    return answers.sort(() => Math.random() - 0.5)
}

function setNextQuestion() {
    resetState()
    displayQuestion(shuffledQuestions[currentQuestionIndex])
}


function displayQuestion(question) {
    questionElement.innerText = question.question
    document.body.classList.add('answering')

    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('b')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', chooseAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    document.body.classList.remove('correct', 'wrong', 'answering')
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}



function chooseAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct

    document.body.classList.remove('answering')
    setStatusClass(document.body, correct)

    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
        button.disabled = true
    })

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        startButton.innerText = 'restart'
        startButton.classList.remove('hide')
    }

}

function setStatusClass(element, correct) {
    element.classList.remove('correct', 'wrong')

    if (correct) {
        element.classList.add('correct')
    } 
    else {
        element.classList.add('wrong')
    }
}




