//This initializes  the continue button to save the prefs permanantly and then move to the reader
let continuebut = document.querySelector('.continueButton')
continuebut.addEventListener('click', async function(event){
    await eel.commitPrefs()();
    window.location.href = 'rss.html';
})


let selectedarray = []
//This just manages selected and not selected feeds
async function prefs(){
    let prefs = await eel.confirmPrefs()();
    await eel.clearPrefs()();
    console.log(prefs)
    let recoms =[]
    fetch('recom.json')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Your parsed JSON object
        for(let i = 0; i<prefs.length; i++){
            recoms.push(data[prefs[i]])
            console.log('looping')
        }
        console.log(recoms)
        let flexcont = document.querySelector('.flexContainer')
        for(let i = 0; i<recoms.length; i++){
            console.log('i',recoms[i])
            let keys = Object.keys(recoms[i])
            console.log(keys.length)
            for(let j = 0; j<keys.length; j++){
                let current = recoms[i][keys[j]];
                let newelm = document.createElement('div')
                let html = `
                    <div class="item" link="${current['RSSSource']}">
                        <img src="${current['imageLink']}" alt="" class="quickDiscoverImage">
                        <p class="inItemText">${current['name']}</p>
                    </div>
                `
                console.log('html Made')
                newelm.innerHTML = html;
                let item = newelm.firstElementChild
                item.addEventListener('click', async function(event){
                    let identifier = event.currentTarget
                    let textbig = identifier.querySelector('.inItemText')
                    let text = textbig.textContent
                    let index = selectedarray.indexOf(text)
                    console.log(text)
                    if (index != -1){
                        selectedarray.splice(index,1);
                        await eel.RemovePref(text)();
                        identifier.style.backgroundColor = '#1e1e1e85'
                    }else{
                        selectedarray.push(text)
                        await eel.Newprefs(text)
                        identifier.style.backgroundColor = '#256a3685'
                    }
                })
                flexcont.appendChild(item)
            }

            
            
        }
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });

}

prefs();
