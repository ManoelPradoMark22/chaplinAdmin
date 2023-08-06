import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged , signOut  } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, onValue, set, push, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getStorage, ref as refStorage } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

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
    closeDeleteModal();
  }, 500);
}

function closingJustDelayModal() {
  clearTimeout(mySetTime);
  setTimeout(() => {
    modal.style.display = "none";
    textLoading.innerHTML = `Aguarde, carregando...`;
    showSuccessIcon();
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
const storage = getStorage(firebaseApp);

const lanchoneteRef = ref(db, 'clubeIbiajara/');
const storageRef = refStorage(storage, 'establishments');

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
  var panel = elem.nextElementSibling;
  if (panel.style.display === "flex") {
    elem.classList.remove("accordionActivate");
    panel.style.display = "none";
  } else {
    elem.classList.add("accordionActivate");
    panel.style.display = "flex";
  }
}

let refModalEditProd = document.getElementById("modalEditProd");
let formEditProdClose = document.querySelector('#formEditProd-close');
let refModalDeleteProd = document.getElementById("modalDeleteProd");
let formDeleteProdClose = document.querySelector('#formDeleteProd-close');

let refModalEditEstablishment = document.getElementById("modalEditEstablishment");
let formEditEstablishmentClose = document.querySelector('#formEditEstablishment-close');
let refModalDeleteEstablishment = document.getElementById("modalDeleteEstablishment");
let formDeleteEstablishmentClose = document.querySelector('#formDeleteEstablishment-close');

formEditProdClose.addEventListener('click', () =>{
  refModalEditProd.classList.remove('active');
});

formDeleteProdClose.addEventListener('click', () =>{
  refModalDeleteProd.classList.remove('active');
});

formEditEstablishmentClose.addEventListener('click', () =>{
  refModalEditEstablishment.classList.remove('active');
});

formDeleteEstablishmentClose.addEventListener('click', () =>{
  refModalDeleteEstablishment.classList.remove('active');
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
let removeProdItemRef;
let otherInfoLanch;

window.openEditModal = function openEditModal(id,obj){
  editItemRef = ref(db, `clubeIbiajara/donates/${id}`);
  buttonEditProd.style.display = "block";
  buttonAddProd.style.display = "none";
  titleModalProd.innerHTML = "Editar";

  inputName.value = obj.name;
  inputValue.value = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    useGrouping: false,
  }).format(obj.value);

  refModalEditProd.classList.add('active');
}

window.closeEditModal = function closeEditModal(){
  refModalEditProd.classList.remove('active');
}

window.closeDeleteModal = function closeDeleteModal(){
  refModalDeleteProd.classList.remove('active');
}

window.clickEditProd = function clickEditProd() {
  var justDot = inputValue.value.replace('R$', "");
  justDot = justDot.replace(',', ".");
  justDot = parseFloat(justDot);
  openModal();
  set(editItemRef, {
   name: inputName.value,
   value: justDot,
   categoryType: "donate",
   isEntrance: true,
   paymentMethod: "pix",
   isPaid: true
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
   value: justDot,
   categoryType: "donate",
   isEntrance: true,
   paymentMethod: "pix",
   isPaid: true
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
  const changeAvaiabilityLanchoneteRef = ref(db, `lanchonete/subsections/${index1}/products/${index2}/available`);

  set(changeAvaiabilityLanchoneteRef, availability).then(() => {
    closeModal();
    showSuccessIcon();
  }).catch((error) => {
    closeModal();
    alert('Erro ao atualizar disponibilidade! Verifique sua conexão e carregue novamente a página!');
  });
}

window.openAddProdModal = function openAddProdModal() {
  addProdItemRef = ref(db, `clubeIbiajara/donates/`);
  buttonEditProd.style.display = "none";
  buttonAddProd.style.display = "block";
  titleModalProd.innerHTML = "Criar";

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

window.clickDeleteProd = function clickDeleteProd() {
  openModal();
  remove(removeProdItemRef).then(() => {
    closingDelayModal();
  }).catch((error) => {
    console.log("erro ao excluir");
  })
}

window.openExcludeModal = function openExcludeModal(id) {
  removeProdItemRef = ref(db, `clubeIbiajara/donates/${id}`);
  refModalDeleteProd.classList.add('active');
}

//----Establishment--
let editEstablishmentRef;
let addEstablishmentRef;
let removeEstablishmentRef;

let titleModalEstablishment = document.getElementById("titleModalEstablishment");
let inputEstablishmentName = document.getElementById("name_field_establishment");
let inputEstablishmentWpp = document.getElementById("wpp_field_establishment");
let inputEstablishmentLink = document.getElementById("link_field_establishment");
let inputEstablishmentImage = document.getElementById("image_field_establishment");
let buttonAddEstablishment = document.getElementById("addEstablishmentButton");
let buttonEditEstablishment = document.getElementById("editEstablishmentButton");
let divImgEstablishment = document.querySelector(".imgEstablishment");

var behavior = function (val) {
  return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
};

const options = {
  onKeyPress: function (val, e, field, options) {
      field.mask(behavior.apply({}, arguments), options);
      console.log(val);
  }
};

$('#wpp_field_establishment').mask(behavior, options);

const btn4_ctn = document.querySelector(".btn4_container");
const button2 = document.querySelector(".button2");
const button3 = document.querySelector(".button3");
btn4_ctn.addEventListener("click", () => {
  button2.classList.toggle("move");
  button3.classList.toggle("push");
  if((button2.classList).length===1) {
    //wpp
    inputEstablishmentLink.style.display = "none";
    inputEstablishmentWpp.style.display = "block";
  }else {
    //link
    inputEstablishmentLink.style.display = "block";
    inputEstablishmentWpp.style.display = "none";
  }
});

window.openAddEstablishmentModal = function openAddEstablishmentModal() {
  addEstablishmentRef = ref(db, `clubeIbiajara/establishments/`);
  buttonEditEstablishment.style.display = "none";
  buttonAddEstablishment.style.display = "block";
  titleModalEstablishment.innerHTML = "Criar";

  inputEstablishmentName.value = "";
  inputEstablishmentWpp.value = "";
  inputEstablishmentLink.value = "";
  inputEstablishmentImage.value = "";
  divImgEstablishment.setAttribute("src", './images/folder_icon.png')

  refModalEditEstablishment.classList.add('active');
}

let file;
let fileName = '';
let uploaded_image_src = ''

inputEstablishmentImage.addEventListener("change", (e) => {
  file = e.target.files[0];
  fileName = Math.round(Math.random() * 9999) + file.name;
  console.log('fileName:', fileName);
  console.log('file:', file);

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    uploaded_image_src = reader.result;
    console.log(uploaded_image_src)
    divImgEstablishment.setAttribute("src", uploaded_image_src)
  });
  reader.readAsDataURL(file);
})

// window.getImageData = function getImageData(e) {
//   file = e.target.files[0];
//   fileName = Math.round(Math.random() * 9999) + file.name;
//   console.log('fileName:', fileName);
//   console.log('file:', file);

//   const reader = new FileReader();
//   reader.addEventListener("load", () => {
//     uploaded_image = reader.result;
//     console.log(uploaded_image)
//     document.querySelector(".imgEstablishment").setAttribute("src", uploaded_image)
//   })
// };

//section Clube
window.loadClubeData = async function loadClubeData() {
  openModal();
  try {
    await onValue(lanchoneteRef, (snapshot) => {
      closingJustDelayModal();
            //START CLUB SECTION
            const allDataClub = snapshot.val();
            const dataClub = []
            Object.entries(allDataClub.donates).map((keyValueDataClub, index) => {
              let dataClubObj = keyValueDataClub[1];
              let dataClubObjKey = keyValueDataClub[0];
      
              dataClubObj.id = dataClubObjKey;
              
              dataClub.push(dataClubObj);
            }); 
      
            dataClub.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            })
      
            let stringDataClub = '';
            dataClub.map(transaction => {
              stringDataClub = `
              ${stringDataClub}
              <div class="donateDiv">
                <div class="liTrans">
                  <span class='nameTrans'>${(String(transaction.name)).toUpperCase()}</span> | <span class="valueTrans ${transaction.isEntrance ? "positive" : "negative"}">${convertToReal(transaction.value)}</span> | <span class="isPaidTrans">${transaction.isPaid ? "✔️" : "AGUARDE"} | </span>
                </div>
                <div class="iconsDiv">
                  <i class="fas fa-trash iconExcludeProd" title="Excluir" onclick="openExcludeModal(
                    '${transaction.id}'
                    )"
                  >
                  </i>
                 | 
                  <i class="far fa-edit iconEditProd" title="Editar" onclick="openEditModal(
                    '${transaction.id}',
                    {
                      name: '${transaction.name}',
                      value: ${transaction.value},
                    })"
                  >
                  </i>
                </div>
              </div>`
            })
      
            document.getElementById('listTransactions').innerHTML = stringDataClub;
      
            const sumTotal = dataClub.reduce(
              (acc, curr) => acc + curr.value,
              0
            );
      
            document.getElementById('dataTotal').innerHTML = convertToReal(sumTotal);


            const dataEstablishments = [];

            Object.entries(allDataClub.establishments).map((keyValueEstablishments, index) => {
              let establishmentsObj = keyValueEstablishments[1];
              let establishmentsObjKey = keyValueEstablishments[0];
      
              establishmentsObj.id = establishmentsObjKey;
              
              dataEstablishments.push(establishmentsObj);
            }); 
      
            dataEstablishments.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            });
      
            let stringEstablishments = '';
            dataEstablishments.map(establishment => {
              stringEstablishments = `${stringEstablishments}
              <div class="establishmentContainer">
                <div class="establishmentBox">
                    <div class="imgEstablishmentDiv">
                      <img class="imgEstablishment" src="${establishment.image}" alt="">
                      <i class="far fa-edit iconLink iconLinkRight"></i>
                      <i class="fas fa-trash iconLink iconLinkLeft"></i>
                    </div>
                    <span class="titleEstablishment">${establishment.name}</span>
                </div>
              </div>
              `
            })

            document.getElementById('establishmentsDiv').innerHTML = stringEstablishments;

    }, (error) => {
      closeModal();
      alert('Erro ao carregar! Verifique sua conexão e carregue novamente a página!');
    })
  } catch {
    closeModal();
    alert('Erro ao carregar! Verifique sua conexão e carregue novamente a página!');
  }
}

loadClubeData();

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
