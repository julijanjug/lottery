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
    const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
}
