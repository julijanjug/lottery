let deadline = null;
let ticker = null;

const submitEntry = async () => {
    let valid = document.forms['entry'].reportValidity();

    if (valid) {
        const response = await fetch(submitUrl, {
            method: 'POST',
            body: JSON.stringify({
                name: document.querySelector('#name').value,
                number: document.querySelector('#number').value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json(); //extract JSON from the http response
    } else {
        //TODO display pretty validation warning
    }

}

const results = async () => {
    const response = await fetch(resultsUrl);
    const json = await response.json();
    var items = json.data;
    let lastResult = items[0];

    //Remove initial item
    items = items.filter(f => f.number != 0);

    // Set countdown
    deadline = new Date(lastResult.timestamp);
    deadline.setSeconds(deadline.getSeconds() + 30);
    deadline.setMilliseconds(1500)

    var results = document.querySelector('#results');
    results.innerHTML = '';

    items.forEach(f => {
        var li = document.createElement('li');
        var winners = document.createElement('div');
        var number = document.createElement('div');
        winners.classList.add("winners");
        number.classList.add("number");

        winners.appendChild(document.createTextNode(f.winners))
        number.appendChild(document.createTextNode(f.number));
        li.appendChild(winners);
        li.appendChild(number);
        results.appendChild(li);
    })

    setCountdown()
}

async function setCountdown() {
    clearInterval(ticker);
    ticker = setInterval(function () {
        var now = new Date();
        var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

        var distance = deadline - utc;
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.querySelector("#countdown").innerHTML = "New winner in " + seconds + "s... ";

        if (distance < 0) {
            clearInterval(ticker);
            document.querySelector("#countdown").innerHTML = "Picking winners...";
            results();
        }
    }, 1000);
}

results();


let nameInput = document.querySelector('#name');
let numberInput = document.querySelector('#number');

nameInput.onblur = inputBlur;
nameInput.onfocus = inputFocus;
numberInput.onblur = inputBlur;
numberInput.onfocus = inputFocus;

function inputFocus(e) {
    this.closest('.float-label-field').classList.add('float', 'focus');
};

function inputBlur() {
    this.closest('.float-label-field').classList.remove('focus');
    if (!this.value) {
        this.closest('.float-label-field').classList.remove('float');
    }
};