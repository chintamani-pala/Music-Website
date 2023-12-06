let contactForm=document.getElementById("contactForm")
function isValidEmail(email) {
    // Regular expression pattern for basic email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

var datePicker = document.getElementById("date");

// Set the max attribute to today's date
datePicker.setAttribute("max", getCurrentDate());

function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
}

contactForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    let sendBtn=document.getElementById("send")
    sendBtn.innerHTML="Sending..."
    sendBtn.disable=true;
    let userName=document.getElementById("name").value;
    let userEmail=document.getElementById("email").value
    let date=document.getElementById("date").value
    let contactReason=document.getElementById("category").value
    let description=document.getElementById("other").value
    let sendMeACopy=false;
    if(document.getElementById("copy").checked){
        sendMeACopy =true;
    }
    if(!isValidEmail(userEmail)){
        topRightSmallToast(`Enter a Valid Email`,`error`)
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
        topRightSmallToast(`Response Send Successfully`,`success`)
        sendBtn.innerHTML="Send"
        sendBtn.disable=false;
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        topRightSmallToast(`Something went wrong contact admin`,`error`)
        sendBtn.disable=false;
    });
})
