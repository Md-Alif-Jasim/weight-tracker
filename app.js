//set todays date
document.getElementById('today').textContent = new Date().toLocaleDateString('en-US',{
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

let entries = JSON.parse(localStorage.getItem('entries') || '[]');

function logWeight(){
    const weight = document.getElementById('weightInput').value;
    const date = document.getElementById('dateInput').value;
    
    if(!weight || !date){
        alert('Please enter weight and date!')
        return;
    }

    entries.push({weight:weight, date:date})
    localStorage.setItem('entries', JSON.stringify(entries))
    displayEntries()
}

function displayEntries(){
    const list = document.getElementById('entriesList');
    list.innerHTML = '';
    entries.forEach(function(entry) {
        list.innerHTML += '<p>' + entry.date +'-'+entry.weight+'lbs</p>';
    });
}

//load entries on page start
displayEntries();
