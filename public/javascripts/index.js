function Widget(widgetId, submitUrl, resultsUrl) {
    var instance = this;
    this.deadline = null;
    this.ticker = null;
    this.resultsUrl = resultsUrl;
    this.submitUrl = submitUrl;
    this.widgetId = widgetId;

    this.submitEntry = async () => {
        let valid = document.forms[instance.widgetId].reportValidity();

        if (valid) {
            const response = await fetch(instance.submitUrl, {
                method: 'POST',
                body: JSON.stringify({
                    name: instance.nameInput.value,
                    number: instance.numberInput.value
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

    const getResults = async () => {
        const response = await fetch(this.resultsUrl);
        const json = await response.json();
        var items = json.data;
        let lastResult = items[0];

        //Remove initial item
        items = items.filter(f => f.number != 0);

        // Set countdown
        this.deadline = new Date(lastResult.timestamp);
        this.deadline.setSeconds(this.deadline.getSeconds() + 30);
        this.deadline.setMilliseconds(1500)

        this.results.innerHTML = '';

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
            this.results.appendChild(li);
        })

        setCountdown()
    }

    const setCountdown = async () => {
        clearInterval(this.ticker);
        this.ticker = setInterval(function () {
            var now = new Date();
            var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

            var distance = instance.deadline - utc;
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            instance.countdown.innerHTML = "New winner in " + seconds + "s... ";

            if (distance < 0) {
                clearInterval(instance.ticker);
                instance.countdown.innerHTML = "Picking winners...";
                getResults();
            }
        }, 1000);
    }

    let wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    let header = document.createElement('div');
    header.classList.add('header');
    header.setAttribute('id', 'countdown');
    header.innerHTML = 'New winner in x s...';
    this.countdown = header;

    let list = document.createElement('div');
    list.classList.add('list');

    let ul = document.createElement('ul');
    this.results = ul;

    let form = document.createElement('div');
    form.classList.add('form');

    let form2 = document.createElement('form');
    form2.setAttribute('id', widgetId);
    form2.setAttribute('action', '#');

    let inputs = document.createElement('div');
    inputs.classList.add('inputs');

    let nameFieldset = document.createElement('fieldset');
    nameFieldset.classList.add('float-label-field');

    let nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'name');
    nameLabel.innerHTML = 'Name';

    let nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('required', true);
    this.nameInput = nameInput;

    let numberFieldset = document.createElement('fieldset');
    numberFieldset.classList.add('float-label-field');

    let numberLabel = document.createElement('label');
    numberLabel.setAttribute('for', 'number');
    numberLabel.innerHTML = 'Number';

    let numberInput = document.createElement('input');
    numberInput.setAttribute('type', 'number');
    numberInput.setAttribute('required', true);
    numberInput.setAttribute('min', 1);
    numberInput.setAttribute('max', 30);
    this.numberInput = numberInput;

    this.inputFocus = function (e) {
        this.closest('.float-label-field').classList.add('float', 'focus');
    };

    this.inputBlur = function () {
        this.closest('.float-label-field').classList.remove('focus');
        if (!this.value) {
            this.closest('.float-label-field').classList.remove('float');
        }
    };

    nameInput.onblur = this.inputBlur;
    nameInput.onfocus = this.inputFocus;
    numberInput.onblur = this.inputBlur;
    numberInput.onfocus = this.inputFocus;

    let button = document.createElement('button');
    button.classList.add('button-36');
    button.onclick = function () {
        instance.submitEntry();
    };
    button.innerHTML = 'Submit';

    list.appendChild(ul);
    form.appendChild(form2);
    form2.appendChild(inputs);
    inputs.appendChild(nameFieldset);
    nameFieldset.appendChild(nameLabel);
    nameFieldset.appendChild(nameInput);
    inputs.appendChild(numberFieldset);
    numberFieldset.appendChild(numberLabel);
    numberFieldset.appendChild(numberInput);
    form.appendChild(button);

    wrapper.appendChild(header);
    wrapper.appendChild(list);
    wrapper.appendChild(form);
    this.element = wrapper;

    getResults();

    this.appendTo = function (parentId) {
        document.querySelector(parentId).appendChild(this.element);
    }
}

const widget1 = new Widget('widget1', 'http://localhost:3000/submit', 'http://localhost:3000/results');
widget1.appendTo('#widget1');
const widget2 = new Widget('widget2', 'http://localhost:3000/submit', 'http://localhost:3000/results');
widget2.appendTo('#widget2');