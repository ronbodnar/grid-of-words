const fetchWordList = async () => {
    var response = await fetch(`word/list`);
    return await response.json();
}

export { fetchWordList }