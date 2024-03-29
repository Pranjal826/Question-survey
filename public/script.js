const questions = [
    { id: 1, text: "How satisfied are you with our products?", type: "Rating", options: [1, 2, 3, 4, 5] },
    { id: 2, text: "How fair are the prices compared to similar retailers?", type: "Rating", options: [1, 2, 3, 4, 5] },
    { id: 3, text: "How satisfied are you with the value for money of your purchase?", type: "Rating", options: [1, 2, 3, 4, 5] },
    { id: 4, text: "On a scale of 1-10, how would you recommend us to your friends and family?", type: "Rating", options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: 5, text: "What could we do to improve our service?", type: "Text" },

  ];

  let currentQuestionIndex = 0;
  let answers = {};
  let sessionId = null;
  let sessionIdSaved = false;

  function startSurvey() {
    sessionId = generateSessionId();
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("surveyScreen").style.display = "block";
    showQuestion();
  }

  function previous() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion();
    }
  }

  function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("questionNumber").innerText = `${currentQuestionIndex + 1}/${questions.length}`;
    document.getElementById("question").innerText = question.text;

    if (question.type === "Rating") {
      showRatingOptions(question);
    } else {
      showTextOptions();
    }

    document.getElementById("prevBtn").disabled = currentQuestionIndex === 0;
  }

  function showRatingOptions(question) {
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.innerText = option;
      button.style.background = `white`;
      button.addEventListener("mouseover", function () {
        this.style.background = "pink";
        this.style.transition = "all 0.5s";
      });
      button.addEventListener("mouseout", function () {
        this.style.background = "white";
        this.style.transition = "all 0.5s";
      });
      button.className = "rounded";
      button.onclick = () => saveAnswer(question.id, option);
      optionsContainer.appendChild(button);
    });
  }


  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      showQuestion();
    } else {
      if (!sessionIdSaved) {
        answers["sessionId"] = sessionId;
        sessionIdSaved = true;
      }

      const textAnswer = document.getElementById("textAnswer").value.trim();
      if (textAnswer !== "") {
        answers[questions[currentQuestionIndex].id] = [{
          answer: textAnswer,
          timestamp: new Date().toISOString()
        }];
      }

      localStorage.setItem('surveyAnswers', JSON.stringify(answers));
      showConfirmationScreen();
    }
  }

  function showTextOptions() {
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = '<textarea id="textAnswer" rows="4" cols="50"></textarea>';
  }

  function saveAnswer(questionId, answer) {
    if (!answers[questionId]) {
      answers[questionId] = [];
    }

    answers[questionId].push({
      answer,
      timestamp: new Date().toISOString()
    });

    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      showQuestion();
    } else {
      if (!sessionIdSaved) {
        answers["sessionId"] = sessionId;
        sessionIdSaved = true;
      }

      const textAnswer = document.getElementById("textAnswer").value.trim();
      if (textAnswer !== "") {
        answers[questions[currentQuestionIndex].id] = [{
          answer: textAnswer,
          timestamp: new Date().toISOString()
        }];
      }

      showConfirmationScreen();
    }
  }

  function showConfirmationScreen() {
    document.getElementById("surveyScreen").style.display = "none";
    document.getElementById("confirmationScreen").style.display = "block";
    document.getElementById("submit").onclick = confirmSubmission;
    document.getElementById("cancel").onclick = cancelSubmission;
  }

  function confirmSubmission() {
    localStorage.setItem('surveyStatus', 'COMPLETED');
    localStorage.setItem('surveyAnswers', JSON.stringify(answers));
    resetSurvey();
    hideConfirmationScreen();
    showThankYouScreen();
  }

  function showThankYouScreen() {
    document.getElementById("confirmationScreen").style.display = "none";
    document.getElementById("showThankyouScreen").style.display = "block";
    document.getElementById("welcomeScreen").style.display = "none";
    setTimeout(function () {
      hideThankYouScreen();
      document.getElementById("welcomeScreen").style.display = "block";
    }, 5000);
  }

  function hideThankYouScreen() {
    document.getElementById("showThankyouScreen").style.display = "none";
  }

  function cancelSubmission() {
    resetSurvey();
    hideConfirmationScreen();
    document.getElementById("welcomeScreen").style.display = "block";
  }

  function hideConfirmationScreen() {
    document.getElementById("confirmationScreen").style.display = "none";
    document.getElementById("welcomeScreen").style.display = "block";
  }

  function resetSurvey() {
    currentQuestionIndex = 0;
    answers = {};
    sessionId = null;
    sessionIdSaved = false;
    document.getElementById("textAnswer").value = "";
  }

  function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }