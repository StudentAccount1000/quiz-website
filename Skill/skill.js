/*
Sticky Navbar code was made with help from: https://www.scaler.com/topics/sticky-navbar-css/
I used outside code since this was not taught in class
*/
function stickynavbar() {
    if (window.scrollY >= navbar_offset) {    
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');    
    }
}


/* NOTE: I wanted to read these from files to make it easier to use but JS cannot read from local files for security reasons anymore. */
// type of question. supports multiple choice, true/false, and select multiple
var question_type = [
    "MC",
    "MC",
    "T/F",
    "MC",
    "SEL",
    "MC",
    "SEL",
    "MC",
    "T/F",
    "MC"
]

// stores the questions
var questions = [
    "Which of the following is NOT a valid Promise state:",
    "Which of these creates a comment in css:",
    "True or False: Bootstrap was created by Microsoft",
    "Which of the following is NOT a Bootstrap button class:",
    "Select all of the ways CSS can be used",
    "Which version of HTML uses *ONLY* <!DOCTYPE html>",
    "Select all of the valid HTML event types listed:",
    "Which best describes the DOM:",
    "The await/async functions in JS have large preformance penalties",
    "What is the closest U.S. State to Africa?"
]

// stores the possible options
var question_options = [
    ["rejected", "pending", "error", "fulfilled"],
    ["/* ... */", "// ...", "There are no comments in CSS styling", "<&#33;-- ... -->"],
    ["True", "False"],
    ["btn-secondary", "btn-lg", "btn-dark", "btn-shadow"],
    ["external", "remote", "internal", "inline"],
    ["HTML 3.0+", "HTML 5", "HTML 1.1", "HTML 4.2+"],
    ["onmouseup", "ondragleft", "onpause", "onclose"],
    ["The Dynamic Object Model is tree of elements linked to each other", "A JavaScript solution for linking memory to HTML elements", "The Document Object Model is a representation of a HTML document in an object based manner", "None of the above"],
    ["True", "False"],
    ["Florida", "Puerto Rico", "Georgia", "Maine"]
]

// stores which option is correct
var answers = [
    2,
    0,
    1,
    3,
    [0, 2, 3],
    1,
    [0, 2],
    2,
    1,
    3
]

// user answers
var user_answers = {}

var q_num = 0
var q_max = questions.length - 1

function begin_quiz() {
    // hide intro
    document.getElementById("intro").style.display = "none"
    // show next/prev buttons
    document.getElementById("question_area").style.display = "block"
    document.getElementById("prev").setAttribute("disabled", "")
    document.getElementById("prev").style.display = "block"
    // show questions
    generateQuestion(q_num)
}

function generateQuestion(num) {
    document.getElementById("question_num").textContent = "Question " + (num + 1) + ":"
    question_desc = document.getElementById("question")
    instruction = document.getElementById("instruction")

    question_desc.textContent = questions[num]
    let use_radio_buttons = true

    switch(question_type[num]) {
        case "MC":
            instruction.textContent = "Select 1 of the options"
            break
        case "T/F":
            instruction.textContent = "Select True or False."
            break
        case "SEL":
            instruction.textContent = "Select all that apply."
            use_radio_buttons = false
            break
        default:
            // this case should not be reached
            alert("Programming Error")
    }
    generateOptions(num, use_radio_buttons)
}

function generateOptions(num, use_radio_buttons) {
    question_opt = document.getElementById("question_options")
    opt_html = "<form>"
    question_options[num].forEach((opt, ind) => {
        if (use_radio_buttons) {
            opt_html += "<input type='radio' value='" + ind + "' name='question'"
            // load if the user has already answered the question
            if (num in user_answers && user_answers[num] == ind) { opt_html += " checked='checked'" }
            opt_html += ">"
    } else {
        opt_html += "<input type='checkbox' value='" + ind + "' name='question'"
        // load if the user has already answered the question
        if (num in user_answers && user_answers[num].includes(ind)) { opt_html += " checked='checked'" }
        opt_html += ">"
    } 
        opt_html += "<label for=' " + ind + "'>" + opt + "</label><br></br>"
    })
    opt_html += "</form>"
    // display new code 
    question_opt.innerHTML = opt_html
}

function prev_question() {
    // bounds checking
    if (q_num > 0){
        save_input()
        q_num--
        // reset questions
        document.getElementById("question_options").innerHTML = ""
        generateQuestion(q_num)

        // check if buttons need to be enabled/disabled
        if (q_num == 0){
            document.getElementById("prev").setAttribute("disabled", "")
        } else if (q_num == q_max - 1){
            document.getElementById("next").removeAttribute("disabled")
        }
    }

}

function next_question() {
    if (q_num < q_max) {
        save_input()
        q_num++
        // reset questions
        document.getElementById("question_options").innerHTML = ""
        generateQuestion(q_num)

        // check if button needs to be enabled/disabled
        if (q_num == 1) {
            document.getElementById("prev").removeAttribute("disabled")
        } else if (q_num == q_max) {
            document.getElementById("next").setAttribute("disabled", "")
            // once the end of the quiz is reached the submit button should stay visible
            document.getElementById("quiz_submit").style.display = "block"
        }
    }
}

function save_input() {
    if (document.querySelector('input[name="question"]:checked') != null){
        if (question_type[q_num] != "SEL") {   //MC and T/F
            user_answers[q_num] = parseInt(document.querySelector('input[name="question"]:checked').value);
        } else {
            let all_selected = document.querySelectorAll('input[name="question"]:checked');
            let converted = []
            for (let i = 0; i < all_selected.length; i++) {
                converted.push(parseInt(all_selected[i].value))
            }
            user_answers[q_num] = converted
        }
    }
}

function grade() {
    // if user is on current question need to save new value before grading
    save_input()

    let score = 0
    for (let i = 0; i <= q_max; i++) {
        if (i in user_answers) {
            if (typeof(user_answers[i]) != "number") {
                // if (_.isEqual(answers[i], user_answers[i])) { score++ }  // no partial credit
                // partial credit
                let partial_right = 0   
                let partial_wrong = 0
                for (let j = 0; j < user_answers[i].length; j++) {
                    if (answers[i].includes(user_answers[i][j])) { partial_right++ } else { partial_wrong++ }
                }
                // punish for wrong answers
                partial_right -= partial_wrong
                // do not want to give negative points for a question, just zero
                if (partial_right < 0){ partial_right = 0 }

                score += partial_right/Math.max(answers[i].length, user_answers[i].length)
            }else {
                if (answers[i] == user_answers[i]){ score++ }
            }
        } 
    }
    // hide quiz
    document.getElementById("question_options").innerHTML = ""
    document.getElementById("question_area").style.display = "none"
    score = Math.round((score/questions.length)*100) // rounds to nearest %
    
    // determine color of alert based on how user preforms
    let result = document.getElementById("quiz_results")
    let type = ""
    if(score <= 60){
        type="danger"
    } else if (score <= 75) {
        type="warning"
    } else {
        type="success"
    }

    // display results
    result.innerHTML = "<h3>The quiz is over! Thank you for taking it.</h3>" + 
    "<div class='alert alert-" + type + "' role='alert' style='width: 30%'><h4 class='alert-heading'>Score: " + score + "%</h4></div>" + 
    `<input type='button' class='btn btn-primary' value='Return to Main Page' onclick='location.href="../main.html"' style=padding-right 10px>` +
    "<input type='button' class='btn btn-success' value='Retake Quiz' onclick='location.reload()'>"
}