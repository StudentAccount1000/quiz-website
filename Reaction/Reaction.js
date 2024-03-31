//  sleep time expects milliseconds
function sleep(time_ms) {
    return new Promise((resolve) => setTimeout(resolve, time_ms));
}

function reveal(elem) {
    document.getElementById(elem).style.display = "block"
}

/* 
Function logic from: https://www.chestysoft.com/imagefile/javascript/get-coordinates.asp
Both FindPosition and Q9event are based on this code
This type of element behavior was not discussed in class so I used an outside source (and cited it)
The code is slighty changed in order to achieve my goal of dynamically flipping an image using an event, 
as well as removing deprecated code (Used in a transformative manner).
*/
function FindPosition(img_elem)
{
    // find offset of container
    if (typeof( img_elem.offsetParent ) != "undefined") {
        for(var posX = 0, posY = 0; img_elem; img_elem = img_elem.offsetParent) {
        posX += img_elem.offsetLeft;
        posY += img_elem.offsetTop;
        }
    return [posX, posY];
    }   // no offsetParent attribute
    else {
        return [img_elem.x, img_elem.y];
    }
}

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

// starts the quiz opening countdown
async function countdown() {
    var cntdwn = document.getElementById("quiz_countdown")
    console.log("Starting Quiz Countdown")
    for (let i = 5; i >= 0; i--) {
        sleep(1000).then(() => {
            cntdwn.textContent = `The quiz will begin in: ${i}`
        });
        await sleep(1000)
    }
    cntdwn.textContent = "Begin Now!"
    //displays all questions - to be removed
    reveal("Q1")
    start_time = new Date()
}

async function run_quiz() { // handles questions disappearing
    
}


// below are functions for handling the quiz questions

function checkQ1() {
    // check that all boxes are set to the right values
    if (box22.checked && !box23.checked && box24.checked && 
        !box32.checked && 
        !box41.checked && box42.checked && 
        box51.checked && !box52.checked && 
        !box62.checked && 
        box72.checked){
            console.log("Q1 complete")
             
            // disable question
            $("#Q1 :input").attr("disabled", true)
            reveal("Q2")
        }
}

function checkQ2(){
    let input = document.getElementById("Q2entry").value.trim().toLowerCase()
    if (!answerQ6){
        
        let acceptable_values = [
            "nineteen eighty four", 
            "nineteen eighty-four", 
            "one thousand nine hundred eighty four", 
            "one thousand nine hundred eight-four"]
        if (acceptable_values.includes(input)){
            console.log("Q2 complete")
            $("#Q2 :input").attr("disabled", true)
            reveal("Q3")
        }
    }else{
        let acceptable_values = [
            "366", 
            "three hundred sixty six", 
            "three hundred sixty-six"]
        if (acceptable_values.includes(input)){
            console.log("Q2 complete")
            $("#Q2 :input").attr("disabled", true)
            reveal("Q7")
        }
    }
    
}

function checkQ3() {
    Q3next = document.getElementById("Q3confirm")
    Q3next.innerHTML = "<p>Are you sure?</p><input type='textarea' id='Q3entry' oninput='Q3textbox()'>"
}


function Q3textbox() {
    text = document.getElementById("Q3entry").value.trim().toLowerCase()
    // check textbox
    if (text === "yes"){
        //disable old parts of question
        $("#Q3 :input").attr("disabled", true)
        // pop up for yes, keeps popping up until says yes
        do {
            if (confirm("Yes? (OK)")) {
                console.log("Q3 done")
                break
            }
        }while (true)
        reveal("Q4")
    }
}

// Q4
// function is called on window resize
$(window).resize(function() {
    document.getElementById("window_size").textContent = "Current window size is: " + $(window).width() + "x" + $(window).height()
    if (!Q4answered && $(window).width() <= 1000 && $(window).height() <= 1000){
        console.log("Q4 done")
        Q4answered = true
        // change status
        stat = document.getElementById("Q4status")
        stat.style.border = "1px solid green"
        stat.style.backgroundColor = "green"
        reveal("Q5")
    }
  });

function checkQ5() {
    text = document.getElementById("Q5entry").value.trim().toUpperCase()
    if (text === "XVIII"){
        console.log("Q5 done")
        $("#Q5 :input").attr("disabled", true)
        reveal("Q6")
    }

    // update Q2 for the Q6 answer
    answerQ6 = true
    document.getElementById("Q2question_text").textContent = "How many days are in a leap year?"
    document.getElementById("Q2entry").removeAttribute('disabled')
    document.getElementById("Q2entry").value = ""
    document.getElementById("Q2button").removeAttribute('disabled')
    console.log("Q2 active")
}

async function checkQ7() {
    slider = document.getElementById("Q7slider")
    if (slider.value == 70) {
        console.log("Q7 done")
        $("#Q7 :input").attr("disabled", true)
        reveal("Q8")
    }
    // need to store value beforehand in case it gets moved again before the time ends
    let val = slider.value
    sleep(1000).then(() => {
        document.getElementById("Q7slider_value").textContent = "Distance from 70: " + Math.abs(70 - val)
    });
    await sleep(1000)
    
}

function checkQ8(){
    console.log("Q8 done")
    $("#Q8 :input").attr("disabled", true)
    stat = document.getElementById("Q8status")
    stat.style.border = "1px solid green"
    stat.style.backgroundColor = "green"
    document.getElementById("Q8correct_is")
    Q8done = true
    reveal("Q9")
}

function Q9event(e)
{
    var PosX = 0;
    var PosY = 0;
    var ImgPos = FindPosition(Q9image);
    
    if (e.pageX || e.pageY) {
        PosX = e.pageX;
        PosY = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        PosX = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
        PosY = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
    PosX = PosX - ImgPos[0];
    PosY = PosY - ImgPos[1];

    // if on left side of image - can't have the user click it!
    if (PosX < 395) {
        Q9image.src = "assets/morph_flipped.jpg"
    } else {
        Q9image.src = "assets/morph.jpg"
    }
}

function checkQ9(){
    if (Q8done) {
        document.getElementById("Q9btn").style.disabled = true
        console.log("Q9 done")
        $("#Q9 :input").attr("disabled", true)
        stat = document.getElementById("Q9status")
        stat.style.border = "1px solid green"
        stat.style.backgroundColor = "green"
        reveal("Q10")
    } else {
        console.log("Too early")
        alert("This is for later, forget you ever saw it")
    }
}

function checkQ10() {
    if (document.getElementById("Q10O1").checked) {
        console.log("Q10 done")
        $("#Q10 :input").attr("disabled", true)
        reveal("end")
    }
    // check time
    var end_time = new Date()
    let total_ms_elapsed = end_time.getTime() - start_time.getTime()
    document.getElementById("time").textContent = "Time taken: " + Math.floor(total_ms_elapsed/60000) + " minutes and " + Math.round((total_ms_elapsed%60000)/1000) + " seconds"
}

// clear all text inputs so a new attempt does not have an advantage
var navbar = document.getElementById("page_navbar");
var navbar_offset = navbar.offsetTop;
window.addEventListener('scroll', stickynavbar);

document.getElementById("Q2entry").value = ""
document.getElementById("Q5entry").value = ""

$('input:radio').each(function () { 
    $(this).prop('checked', false)
});

$('input:checkbox').each(function () { 
    $(this).prop('checked', false)
});

var Q7slider = document.getElementById("Q7slider")
Q7slider.value = 20

var start_time = null
countdown(5)


// Answer specific code

// Q1 checkboxes
var box22 = document.getElementById("b22")
var box23 = document.getElementById("b23")
var box24 = document.getElementById("b24")
var box32 = document.getElementById("b32")
var box41 = document.getElementById("b41")
var box42 = document.getElementById("b42")
var box51 = document.getElementById("b51")
var box52 = document.getElementById("b52")
var box62 = document.getElementById("b62")
var box72 = document.getElementById("b72")

// Q4
document.getElementById("window_size").textContent = "Current window size is: " + $(window).width() + "x" + $(window).height()
let Q4answered = false

// Q6

// logic for determining if Q2 has been answered yet in order to replace it
var answerQ6 = false

// Q7
Q7slider.addEventListener('change', checkQ7)

// Q9
var Q9image = document.getElementById("Q9img")
//cant press button up top too early
var Q8done = false


