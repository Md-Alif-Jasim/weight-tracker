import { auth, db } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

let entries = [];
let currentUser = null;

// Redirect to login if not logged in
onAuthStateChanged(auth, async function(user) {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    currentUser = user;
    await loadEntries();
    await loadGoal();
    displayEntries();
    updateGoal();
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async function() {
  await signOut(auth);
  window.location.href = 'login.html';
});

// Set today's date
document.getElementById('today').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Load entries from Firestore
async function loadEntries() {
  entries = [];
  const snapshot = await getDocs(collection(db, 'users', currentUser.uid, 'entries'));
  snapshot.forEach(function(d) {
    entries.push({ id: d.id, ...d.data() });
  });
  entries.sort((a, b) => a.date.localeCompare(b.date));
}

// Load goal from Firestore
async function loadGoal() {
  const goalDoc = await getDoc(doc(db, 'users', currentUser.uid, 'goal', 'current'));
  if (goalDoc.exists()) {
    document.getElementById('goalInput').value = goalDoc.data().value;
  }
}

// Log weight
async function logWeight() {
  const weight = document.getElementById('weightInput').value;
  const date = document.getElementById('dateInput').value;

  if (!weight || !date) {
    alert('Please enter weight and date!');
    return;
  }

  const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'entries'), {
    weight: weight,
    date: date
  });

  entries.push({ id: docRef.id, weight: weight, date: date });
  entries.sort((a, b) => a.date.localeCompare(b.date));
  displayEntries();
  updateGoal();
}

// Display entries
function displayEntries() {
  const list = document.getElementById('entriesList');
  list.innerHTML = '';
  if (entries.length === 0) {
    list.innerHTML = '<p>No entries yet</p>';
    return;
  }
  entries.forEach(function(entry, index) {
    const formattedDate = new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    list.innerHTML += '<div class="entry">' +
      '<span>' + formattedDate + ' — ' + entry.weight + ' lbs</span>' +
      '<button class="del-btn" onclick="deleteEntry(' + index + ')">x</button>' +
      '</div>';
  });
}

// Delete entry
async function deleteEntry(index) {
  const entry = entries[index];
  await deleteDoc(doc(db, 'users', currentUser.uid, 'entries', entry.id));
  entries.splice(index, 1);
  displayEntries();
  updateGoal();
}

// BMI Calculator
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

// Set goal
async function setGoal() {
  const goal = parseFloat(document.getElementById('goalInput').value);
  if (!goal) {
    alert('Please enter a goal weight');
    return;
  }
  await setDoc(doc(db, 'users', currentUser.uid, 'goal', 'current'), { value: goal });
  updateGoal();
}

// Update goal display
function updateGoal() {
  const goal = parseFloat(document.getElementById('goalInput').value);
  if (!goal || entries.length === 0) return;
  const current = parseFloat(entries[entries.length - 1].weight);
  const remaining = Math.abs(current - goal).toFixed(1);
  document.getElementById('goalCurrent').textContent = current + ' lbs';
  document.getElementById('goalTarget').textContent = goal + ' lbs';
  document.getElementById('goalRemaining').textContent = remaining + ' lbs';
}

// Initialize date picker
flatpickr('#dateInput', {
  dateFormat: 'Y-m-d',
  maxDate: 'today',
  placeholder: 'Select Date'
});

// Expose functions to HTML
window.logWeight = logWeight;
window.deleteEntry = deleteEntry;
window.calcBMI = calcBMI;
window.setGoal = setGoal;