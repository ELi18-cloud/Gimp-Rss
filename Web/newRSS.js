//This is the html under the new rss tab
newRSSHtml = `
        <h3 class="align">Name</h3>
        <input type="text" id="name" class="align darkText">
        <h3 class="align">Link</h3>
        <input type="text" id="link" class="align darkText">
        <br>
        <button class="gotoRSS align" id="confirm" style="width: 10vw;">Add Feed</button>
`

//this is just here so later I can get these without makeing a function async
async function getNames(){
    let nameList = await eel.sendNames()();
    return nameList
}


let specialCharacters = true
let newRSSBtn = document.querySelector('#addNew')
//This is what puts the html in when the new rss button is clicked
newRSSBtn.addEventListener('click',async function(event){
    let contain = document.querySelector('.rssCont');
    contain.innerHTML = newRSSHtml;
    let nameField = document.querySelector('#name');
    //This makes sure the user stays compliant with what we can put in id's otherthan spaces
    nameField.addEventListener('input', function(event){
        let text = event.target.value;
        const regex = /[^a-zA-Z0-9 ]/;
        specialCharacters = regex.test(text);
        if (specialCharacters == true){
            event.target.style.borderColor = '#ec0e0e55'
        }else{
            event.target.style.borderColor = '#7dff8155'
        }
    });
    let confirmBut = document.querySelector('#confirm');
    //This is the button that sends everything over to the python to be stored
    confirmBut.addEventListener('click', async function (event) {
        let name = document.querySelector('#name');
        let link = document.querySelector('#link');
        if(specialCharacters == true){
            name.value = 'Invalid Characters Try Again'
        }else{
            let success = await eel.newRSSFeed(name.value, link.value)();
            if(success == true){
                nameToBtn([name.value])
                await eel.loadIntoMem()();
            }
        }
    });
    //This part is for deleteing the rss feed you want to
    let nameList = await getNames();
    console.log(nameList)
    for(let i = 0; i<nameList.length; i++){
        let delterHtml = `
            <div class="feedManCont">
                <h2 class="text">${nameList[i]}</h2>
                <div class="absoDe">
                    <button class="deleter"></button>
                </div>
            </div>`
        let tempelm = document.createElement('div');
        tempelm.innerHTML = delterHtml;
        let elm = tempelm.firstElementChild
        elm.id = nameList[i].replace(/\s+/g, "_");

        let Dbutton = elm.querySelector('.deleter');
        //this is for the delete button and actual deleteing of rss feeds
        Dbutton.addEventListener('click',async function(event){
            let elm = event.currentTarget
            let grando = elm.parentElement.parentElement;
            if(elm.classList.contains('clicked') != true){
                elm.classList.add('clicked')
                let text = grando.querySelector('.text')
                text.textContent = 'Click Again To Delete'
            }else{
                await eel.deleteFeed(grando.id)();
                let names = await eel.sendNames()();
                let sidebar = document.querySelector('.sideBar')
                sidebar.innerHTML = ''
                nameToBtn(names)
                grando.remove();
            }
        });
        document.querySelector('.rssCont').appendChild(elm);
    }
})