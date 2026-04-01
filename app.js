import { auth } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Redirect to login if not logged in
onAuthStateChanged(auth, function(user) {
  if (!user) {
    window.location.href = 'login.html';
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async function() {
  await signOut(auth);
  window.location.href = 'login.html';
});


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
    entries.forEach(function(entry, index){
        const formattedDate = new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }); 
        list.innerHTML += '<div class="entry">'+'<span>'+formattedDate+' — '+entry.weight+
        ' lbs</span>'+'<button class="del-btn" onclick="deleteEntry(' +index+ ')">x</button>' + '</div>';
    });
}

//delete entry
function deleteEntry(index){
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    displayEntries();
}

function calcBMI() {
  if (entries.length === 0) {
    alert('Please log a weight entry first!');
    return;
  }

  const ft = parseFloat(document.getElementById('heightFt').value);
  const inches = parseFloat(document.getElementById('heightIn').value);
  const latestWeight = entries[entries.length - 1].weight;

  if (!ft || !inches) {
    alert('Please enter your height!');
    return;
  }

  const totalInches = (ft * 12) + inches;
  const bmi = (latestWeight / (totalInches * totalInches)) * 703;

  document.getElementById('bmiResult').textContent = 'BMI: ' + bmi.toFixed(1);
}

//load entries on page start
displayEntries();

//Initialize date pickers
flatpickr('#dateInput',{
    //theme: 'dark',
    dateFormat: 'Y-m-d',
    maxDate: 'today',
    placeholder: 'Select Date'
})

//Setting Goal card
function setGoal(){
    const goal = parseFloat(document.getElementById('goalInput').value);

    if(!goal){
        alert('Please enter a goal weight');
        return;
    }

    localStorage.setItem('goal',goal);
    updateGoal();
}

function updateGoal(){
    const goal = parseFloat(localStorage.getItem('goal'));
    if(!goal || entries.length === 0) return;

    const current = parseFloat(entries[entries.length -1].weight);
    const remaining = Math.abs(current - goal).toFixed(1);

    document.getElementById('goalCurrent').textContent = current + ' lbs';
    document.getElementById('goalTarget').textContent = goal + ' lbs';
    document.getElementById('goalRemaining').textContent = remaining + ' lbs';
}
displayEntries();
updateGoal();
