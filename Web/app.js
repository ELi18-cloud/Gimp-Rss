console.log('Starting')
//this gets all the catogory names
let covers = document.querySelectorAll('.coverHolder');
console.log(covers)

elmeArray = [];
//this manages the selected and not select catogories
for(let i=0; i<covers.length; i++){
    console.log('for looping')
    covers[i].addEventListener('click', async function(event){
        let el = event.currentTarget;
        let circle = el.querySelector('.check');
        let indi = elmeArray.indexOf(circle);
        let name = el.querySelector('.name');
        console.log(el)
        console.log(name)

        console.log(elmeArray)
        if(indi != -1){
            console.log(circle)
            circle.style.display = 'none';
            elmeArray.splice(indi, 1);
            console.log(name.text)
            await eel.RemovePref(name.textContent);

        }else{
            console.log(circle)
            circle.style.display = 'block'
            elmeArray.push(circle);
            console.log(name.text)
            await eel.Newprefs(name.textContent);
        }

    })
}