const startGameListener = async () => {
    console.log('Quick game clicked');
    var params = new URLSearchParams({
        wordLength: 5
    });
    try {
        //var response = await fetch(`/game/new?${params.toString()}`, {
        var response = await fetch(`/game/?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error);
    }
}

const addButtonListeners = () => {
    const button = document.querySelector('#quickGame');
    if (button) {
        button.addEventListener('click', startGameListener);
    }
}

addButtonListeners();