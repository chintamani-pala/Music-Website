

let contactForm = document.getElementById("contactForm");
let sendBtn = document.getElementById("send");

function isValidEmail(email) {
    // Regular expression pattern for basic email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

// Get the date input element
var datePicker = document.getElementById("date");

// Set the max attribute to today's date
datePicker.setAttribute("max", getCurrentDate());

function sendData() {
    sendBtn.innerHTML = "Sending...";
    sendBtn.disabled = true;

    let userName = document.getElementById("name").value;
    let userEmail = document.getElementById("email").value;
    let date = document.getElementById("date").value;
    let contactReason = document.getElementById("category").value;
    let description = document.getElementById("other").value;
    let sendMeACopy = document.getElementById("copy").checked;

    if (!isValidEmail(userEmail)) {
        topRightSmallToast(`Enter a Valid Email`, `error`);
        return;
    }

    const data = {
        userName: userName,
        userEmail: userEmail,
        date: date,
        contactReason: contactReason,
        description: description,
        sendMeACopy: sendMeACopy
    };

    fetch('https://contact-api-chintamanipala-chintamani-pala.vercel.app/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        topRightSmallToast(`Response Sent Successfully`, `success`);
        sendBtn.innerHTML = "Send";
        sendBtn.disabled = false;
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        topRightSmallToast(`Something went wrong, please contact admin`, `error`);
        sendBtn.disabled = false;
    });
}

function handleSubmit(e) {
    e.preventDefault();
    sendData();
}

function removeListener() {
    contactForm.removeEventListener("submit", handleSubmit);
}

function addListener() {
    contactForm.addEventListener("submit", handleSubmit);
}

addListener(); // Adding initial event listener
