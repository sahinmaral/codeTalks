const translateErrorMessage = (errorMessage) => {
    switch(errorMessage){
        case "This user has already accepted to this channel":
            return "Zaten bu kanalda yer almaktasınız"
        default:
            return errorMessage;
    }
}

export default translateErrorMessage