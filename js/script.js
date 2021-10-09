import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged , signOut  } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, onValue, set, push } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

function updateStatus(event) {
  if(navigator.onLine) {
    document.getElementById("divStatusConnection").style.display = "none";
  } else {
    document.getElementById("divStatusConnection").style.display = "block";
  }
}

let formBtn = document.querySelector('#login-btn');
let loginForm = document.querySelector('.login-form-container');
let formClose = document.querySelector('#form-close');

let refModalLog = document.getElementById("modalLogin");

function closeFormLogin() {
  refModalLog.classList.remove('active');
}

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

function closingDelayModal() {
  clearTimeout(mySetTime);
  setTimeout(() => {
    modal.style.display = "none";
    textLoading.innerHTML = `Aguarde, carregando...`;
    showSuccessIcon();
    closeEditModal();
  }, 500);
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
  document.getElementById("firstLoadPage").style.display = "none";
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
    closeFormLogin();
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
    closeFormLogin();
  }).catch((error) => {
    closeModal();
    alert("Erro ao fazer logout! Verifique sua conexão e tente novamente!");
  });
}

function convertToReal(value) {
  const valueConverted = value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
  return valueConverted;
}

window.clickAccordion = function clickAccordion(elem) {
  elem.classList.toggle("accordionActivate");
  var panel = elem.nextElementSibling;
  if (panel.style.display === "flex") {
  panel.style.display = "none";
  } else {
  panel.style.display = "flex";
  }
}

let refModalEditProd = document.getElementById("modalEditProd");
let formEditProdClose = document.querySelector('#formEditProd-close');

formEditProdClose.addEventListener('click', () =>{
  refModalEditProd.classList.remove('active');
});

let titleModalProd = document.getElementById("titleModalProd");
let inputName = document.getElementById("name_field");
let inputDescription = document.getElementById("description_field");
let inputValue = document.getElementById("value_field");
let inputLinkImg = document.getElementById("linkImg_field");
let buttonAddProd = document.getElementById("addProdButton");
let buttonEditProd = document.getElementById("editProdButton");

const inputValueQuery = document.querySelector('input[name="priceProd"]');

inputValueQuery.addEventListener("keydown", function(e) {
  setTimeout(function() {
    let value = e.target.value;

    value = value.replace(/\D/g,"");

    value = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      useGrouping: false,
    }).format(value/100);

    e.target.value = value;
  }, 1)
});

let editItemRef;
let addProdItemRef;
let otherInfoLanch;
let idAccordionStaysOpen;

window.openEditModal = function openEditModal(index1, index2, objProd, idSubsec){
  editItemRef = ref(db, `lanchonete/subsections/${index1}/products/${index2}`);
  buttonEditProd.style.display = "block";
  buttonAddProd.style.display = "none";
  titleModalProd.innerHTML = "Editar";

  idAccordionStaysOpen = idSubsec;

  inputName.value = objProd.name;
  inputDescription.value = objProd.description;
  inputValue.value = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    useGrouping: false,
  }).format(objProd.value);
  inputLinkImg.value = objProd.imgLink;

  otherInfoLanch = {
    available: objProd.available,
    id: objProd.id,
    display: objProd.display,
    price: objProd.price,
    number: objProd.number
  };

  refModalEditProd.classList.add('active');
}

function rearrangeAccordion() {
  var refAccordion = document.getElementById(idAccordionStaysOpen);
  refAccordion.classList.add("accordionActivate");
  var panelOppened = refAccordion.nextElementSibling;
  panelOppened.style.display = "flex";
}

window.closeEditModal = function closeEditModal(){
  rearrangeAccordion();
  refModalEditProd.classList.remove('active');
}

window.clickEditProd = function clickEditProd() {
  var justDot = inputValue.value.replace('R$', "");
  justDot = justDot.replace(',', ".");
  justDot = parseFloat(justDot);
  openModal();
  set(editItemRef, {
   name: inputName.value,
   description: inputDescription.value,
   priceNumb: justDot,
   img: inputLinkImg.value,
   available: otherInfoLanch.available,
   id: otherInfoLanch.id,
   display: otherInfoLanch.display,
   price: otherInfoLanch.price,
   number: otherInfoLanch.number
  }).then(() => {
    closingDelayModal();
  }).catch((error) => {
    closeModal();
    alert('Erro ao editar! Verifique sua conexão e carregue novamente a página!');
  });
}

window.clickAddProd = function clickAddProd() {
  var justDot = inputValue.value.replace('R$', "");
  justDot = justDot.replace(',', ".");
  justDot = parseFloat(justDot);
  openModal();
  set(push(addProdItemRef), {
   name: inputName.value,
   description: inputDescription.value,
   priceNumb: justDot,
   img: inputLinkImg.value,
   available: true,
   id: "vai tirar",
   display: "vai tirar",
   price: "vai tirar",
   number: "vai tirar"
  }).then(() => {
    console.log('criou');
    closingDelayModal();
  }).catch((error) => {
    closeModal();
    alert('Erro ao criar produto! Verifique sua conexão e carregue novamente a página!');
  });
}


window.changeAvailableLanchonete = function changeAvailableLanchonete(index1, index2, availability, idSubsec) {
  openModal();
  idAccordionStaysOpen = idSubsec;
  rearrangeAccordion();
  const changeAvaiabilityLanchoneteRef = ref(db, `lanchonete/subsections/${index1}/products/${index2}/available`);

  set(changeAvaiabilityLanchoneteRef, availability).then(() => {
    closeModal();
    rearrangeAccordion();
    showSuccessIcon();
  }).catch((error) => {
    closeModal();
    alert('Erro ao atualizar disponibilidade! Verifique sua conexão e carregue novamente a página!');
  });
}

window.openAddProdModal = function openAddProdModal(sectionName, indexSection, idSubsec) {
  addProdItemRef = ref(db, `${sectionName}/subsections/${indexSection}/products/`);
  buttonEditProd.style.display = "none";
  buttonAddProd.style.display = "block";
  titleModalProd.innerHTML = "Criar";

  idAccordionStaysOpen = idSubsec;

  inputName.value = "";
  inputDescription.value = "";
  inputValue.value = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    useGrouping: false,
  }).format(0);
  inputLinkImg.value = "";

  refModalEditProd.classList.add('active');
}

window.openExcludeModal = function openExcludeModal(subsecId, prodId) {

}

window.loadLanchonete = async function loadLanchonete() {
  openModal();
  try {
    await onValue(lanchoneteRef, (snapshot) => {
      closingDelayModal();
      document.getElementById("idButtonLoadSectionLanchonete").style.display = "none";
       /*AQUI VOU FAZER OS MAPS DAS SEÇÕES! */
      document.getElementById('userLoggedLanchonete').innerHTML = snapshot.val().subsections.map((subsec, index1) => 
        `<div>
          <button id="${index1+subsec.name}" type="button" class="accordion" onclick="clickAccordion(this)">${subsec.name}</button>
          <div class="panel">
            <button class="buttonLoadSection buttonAddProd" type="button" onclick="openAddProdModal('lanchonete', ${index1}, '${index1+subsec.name}')">
              Criar Produto
            </button>
            <div class="boxWrapContent">
              ${Object.entries(subsec.products).map( (prod, index2) =>
                `
                  <div class="userContentData userContentDataNormal">
                    <i class="fas fa-trash iconExcludeProd" title="Excluir" onclick="openExcludeModal(
                      ${index1},
                      '${prod[0]}',
                      )"
                      >
                    </i>
                  
                    <i class="far fa-edit iconEditProd" title="Editar" onclick="openEditModal(
                      ${index1},
                      '${prod[0]}',
                      {
                        name: '${prod[1].name}',
                        description: '${prod[1].description}',
                        value: ${prod[1].priceNumb},
                        imgLink: '${prod[1].img}',
                        available: ${prod[1].available},
                        id: '${prod[1].id}',
                        display: '${prod[1].display}',
                        price: '${prod[1].price}',
                        number: '${prod[1].number}'
                      },
                      '${index1+subsec.name}')"
                      >
                    </i>
                    <h1>${prod[1].name}</h1>
                    <div>${prod[1].description}</div>
                    <div>${convertToReal(prod[1].priceNumb)}</div>
                    <div>
                      <span>Link da imagem: </span>
                      <a href=${prod[1].img} target="_blank">
                      ${prod[1].img}
                      </a>
                    </div>
                    <div class="boxAvaiability">
                      <div class="circleAvailabilty ${prod[1].available ? 'colorGreen' : 'colorRed'}"></div>
                      <h3>${prod[1].available ? 'Disponível' : 'Indisponível'}</h3>
                    </div>
                    <button type="button" onclick="changeAvailableLanchonete(${index1}, '${prod[0]}', ${!prod[1].available}, '${index1+subsec.name}')">Alternar disponibilidade</button>
                  </div>
                `
              ).join('')}
            </div>
          </div>
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

function hideSuccessIcon() {
  document.getElementById("divSuccessIcon").style.display = "none";
}

function showSuccessIcon() {
  document.getElementById("divSuccessIcon").style.display = "flex";
  setTimeout(hideSuccessIcon, 500);
}

window.changeAvailableAdd = function changeAvailableAdd(index, availability) {
  openModal();
  const addItemRef = ref(db, `adittionals/${index}/available`);

  set(addItemRef, availability).then(() => {
    closeModal();
    showSuccessIcon();
  }).catch((error) => {
    closeModal();
    alert('Erro ao atualizar disponibilidade! Verifique sua conexão e carregue novamente a página!');
  });
}

window.loadAdittionals = async function loadAdittionals() {
  openModal();
  try {
    await onValue(acaiRef, (snapshot) => {
      closingDelayModal();
      document.getElementById("idButtonLoadSectionAdittionals").style.display = "none";
       /*AQUI VOU FAZER OS MAPS DAS SEÇÕES! */
      document.getElementById('userLoggedAdittionals').innerHTML = snapshot.val().map((add, index) => 
        `<div class="userContentData userContentDataSmall">
          <h1>${add.name}</h1>
          <div class="boxAvaiability">
            <div class="circleAvailabilty ${add.available ? 'colorGreen' : 'colorRed'}"></div>
            <h3>${add.available ? 'Disponível' : 'Indisponível'}</h3>
          </div>
          <button type="button" onclick="changeAvailableAdd(${index}, ${!add.available})">Alternar</button>
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



//CLOSE AND OPEN LOGIN/LOGOUT FORM


formBtn.addEventListener('click', () =>{
    loginForm.classList.add('active');
});

formClose.addEventListener('click', () =>{
    loginForm.classList.remove('active');
});
