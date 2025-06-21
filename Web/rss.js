
//This function makes all the side bar buttons and is called every time a new rss is made or an rss is removed
function nameToBtn(listONames){
    for(let i=0; i<listONames.length; i++){
        let newName
        if(listONames[i].length > 10){
            newName = listONames[i].slice(0,15)
            newName = newName + '...'
        }else{
            newName = listONames[i]
        }
        let safeId = listONames[i].replace(/\s+/g, "_");
        let html = `
        <button class="gotoRSS" id=${safeId}>${newName}</button>
        `
        let elmy = document.createElement('div')
        elmy.innerHTML = html
        let nameelm = elmy.firstElementChild

        //When a sidebar element is clicked it calls the getrss function and then makes a feed by looping over everything
        nameelm.addEventListener('click', async function(event) {
            let elm = event.currentTarget.id;
            console.log(elm)
            let rssFeed = await eel.getRss(elm)();
            if(rssFeed[0] != 'Failure to Get RSS'){
                let container =document.querySelector('.rssCont');
                container.innerHTML = "";
                for(let j = 0; j<rssFeed.length; j++){
                    let newElement = document.createElement('div');
                    newElement.innerHTML = rssFeed[j]
                    container.appendChild(newElement.firstElementChild)
                }
                let anchors = document.querySelectorAll('.goto');
                console.log(anchors)
                for(let j = 0; j<anchors.length; j++){
                    anchors[j].addEventListener('click', async function(event){
                    event.preventDefault();
                    let link = event.currentTarget.href
                    await eel.openLink(link)();
                    })
                }
            }
        })


        let cont = document.querySelector('.sideBar')
        cont.appendChild(nameelm)


        
         
    }
}
// I belive this is dead code but as of writing this comment I have compiled and I want to keep the code the same as the compiled so...
let newBtn = document.querySelector('#addNew')
newBtn.addEventListener('click', async function (event) {
});

//This keeps all the rss feed process inline
async function processManager(){
    await eel.loadIntoMem()();
    let names = await eel.sendNames()();
    console.log(names)
    nameToBtn(names);
}
processManager()