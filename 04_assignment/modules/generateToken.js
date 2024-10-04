function generateToken(username) {
    let mixCharString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRSTUVWXYZ0123456789!@#$%^&*()~';
    let finalString = '';
    let length = mixCharString.length;

    for (let i = 0; i < 10; i++) {  // Generate a token of length 10
        let randomNum = Math.floor(Math.random() * length);  // Valid index
        finalString += mixCharString.charAt(randomNum);
    }

    return finalString;
}

module.exports = generateToken;
