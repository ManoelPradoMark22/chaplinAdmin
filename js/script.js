import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged , signOut  } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Get the modal
var modal = document.getElementById("myModal");

function DezSegundos(){
  document.getElementById("textLoading").innerHTML = `Aguarde, carregando...<br>Verifique sua conexão...`;
}

var mySetTime;

function closeModal() {
  clearTimeout(mySetTime);
  modal.style.display = "none";
  document.getElementById("textLoading").innerHTML = `Aguarde, carregando...`;
}

function openModal() {
  modal.style.display = "flex";
  mySetTime = setTimeout(DezSegundos, 10000);
}

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBjp1xZR6T0fBs4uYST8PNV7rC2rUxNjpg",
  authDomain: "e-commerce-3c41b.firebaseapp.com",
  databaseURL: "https://e-commerce-3c41b-default-rtdb.firebaseio.com",
  projectId: "e-commerce-3c41b",
  storageBucket: "e-commerce-3c41b.appspot.com",
  messagingSenderId: "352196438207",
  appId: "1:352196438207:web:40360967b69b7bf4093e0a",
  measurementId: "G-86PHKPHGWE"
});

const db = getDatabase(firebaseApp);
const lanchoneteRef = ref(db, 'lanchonete/');
const acaiRef = ref(db, 'adittionals/');

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("logout_Modal").style.display = "initial";
    document.getElementById("login_Modal").style.display = "none";
    document.getElementById("userLogged").style.display = "flex";
    document.getElementById("userNotLogged").style.display = "none";
  } else {
    document.getElementById("logout_Modal").style.display = "none";
    document.getElementById("login_Modal").style.display = "initial";
    document.getElementById("userLogged").style.display = "none";
    document.getElementById("userNotLogged").style.display = "flex";
  }
})

window.clickLogin = function clickLogin() {
  openModal();
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  signInWithEmailAndPassword(auth, userEmail, userPass)
  .then((userCredential) => {
    closeModal();
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    closeModal();
    const errorCode = error.code;
    /*const errorMessage = error.message; */
    switch(errorCode){
      case 'auth/user-not-found':
        alert("Usuário não encontrado! | "+errorCode);
        break;
      case 'auth/wrong-password':
        alert("Senha incorreta! | "+errorCode);
        break;
      case 'auth/invalid-email':
        alert("E-mail inválido! | "+errorCode);
        break;
      case 'auth/internal-error':
        alert("Erro interno! Verifique seus dados e sua conexão! | "+errorCode);
        break;
      case 'auth/timeout':
        alert("Erro ao fazer login. Verifique sua conexão! | "+errorCode);
        break;
      case 'auth/network-request-failed' :
        alert("Erro ao fazer login. Verifique sua conexão! | "+errorCode);
        break;
      default:
        alert("Erro ao fazer login. Verifique sua conexão! | "+errorCode);
        break;
    }
  });
}

window.clickLogout = function clickLogout() {
  openModal();
  signOut(auth).then(() => {
    closeModal();
  }).catch((error) => {
    closeModal();
    alert("Erro ao fazer logout! Verifique sua conexão e tente novamente!");
  });
}

//DATABASE
let lanchoneteArray = [];

function showArrLachonete(arr) {
  lanchoneteArray = arr;
}

window.loadLanchonete = async function loadLanchonete() {
  openModal();
  try {
    await onValue(lanchoneteRef, (snapshot) => {
      closeModal();
      showArrLachonete(snapshot.val());
       /*AQUI VOU FAZER OS MAPS DAS SEÇÕES! */
      document.getElementById('userLoggedLanchonete').innerHTML = snapshot.val().subsections.map(subsec => 
        `<div>
          <h1>${subsec.name}</h1>
          ${subsec.products.map(prod =>
            `
              <p>
                <div>${prod.name}</div>
                <div>${prod.description}</div>
              </p>
            `
          ).join('')}
        </div>`
      ).join('')


    }, (error) => {
      closeModal();
      alert('Erro ao carregar! Verifique sua conexão e carregue novamente a página!');
    })
  } catch {
    closeModal();
    alert('Erro ao carregar! Verifique sua conexão e carregue novamente a página!');
  }
}

window.changeAvailableAdd = function changeAvailableAdd(index, availability) {
  openModal();
  const addItemRef = ref(db, `adittionals/${index}/available`);

  set(addItemRef, availability).then(() => {
    closeModal();
    alert('Editado com sucesso!');
  }).catch((error) => {
    closeModal();
    alert('Erro ao atualizar! Verifique sua conexão e carregue novamente a página!');
  });
}

window.loadAdittionals = async function loadAdittionals() {
  openModal();
  try {
    await onValue(acaiRef, (snapshot) => {
      closeModal();
      showArrLachonete(snapshot.val());
       /*AQUI VOU FAZER OS MAPS DAS SEÇÕES! */
      document.getElementById('userLoggedAdittionals').innerHTML = snapshot.val().map((add, index) => 
        `<div>
          <h1>${add.name}</h1>
          <h3>Estado atual: ${add.available ? 'Disponível' : 'Indisponível'}</h3>
          <button type="button" onclick="changeAvailableAdd(${index}, ${!add.available})">Marcar como ${add.available ? 'Indisponível' : 'Disponível'}</button>
        </div>`
      ).join('')


    }, (error) => {
      alert('Erro ao carregar! Verifique sua conexão e carregue novamente a página!');
      closeModal();
    })
  } catch {
    alert('Erro ao carregar! Verifique sua conexão e carregue novamente a página!');
    closeModal();
  }
}



//CODE

let formBtn = document.querySelector('#login-btn');
let loginForm = document.querySelector('.login-form-container');
let formClose = document.querySelector('#form-close');


formBtn.addEventListener('click', () =>{
    loginForm.classList.add('active');
});

formClose.addEventListener('click', () =>{
    loginForm.classList.remove('active');
});
