//This just checks if the set up process has been finished beofore and changes accordingly
async function knowner() {
    let status = await eel.checkKnown()();
    let continueBtn = document.querySelector('.continueButton'); 
    console.log(continueBtn)
    if(status == true){
        continueBtn.href = 'rss.html';
        continueBtn.textContent = 'Go To RSS'
    }else{
        continueBtn.href = 'preselect.html';
        continueBtn.textContent = 'Join Today'
    }
}
knowner();