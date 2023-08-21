console.log("works")

const uri = 'http://localhost:5000/api/v1/autores'
//const uri = 'https://deploy-blog-viajes.herokuapp.com/api/v1/autores'

let autores = []

const getItems = () => {
  fetch(uri, {cors: "no-cors"})
    .then(response => response.json())
    .then(data => {
      const authors = data.data
      _displayData(authors)
    })
    .catch(error => console.error('Unable to get items.', error));
}

const addItem = () => {
  const emailInput = document.getElementById('add-email');
  const passwordInput = document.getElementById('add-password');
  const usernameInput = document.getElementById('add-username');
  const item = {
    email: emailInput.value.trim(),
    contrasena: passwordInput.value.trim(),
    pseudonimo: usernameInput.value.trim()
  }
  fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getItems();
      emailInput.value = ''
      passwordInput.value = ''
      usernameInput.value = ''
    })
    .catch(error => console.error('Unable to add item.', error));
}

const deleteItem = (id) => {
  const resultConfirm = confirm("¿Esta seguro de eliminar el autor seleccionado?")
  if(!resultConfirm) return
  fetch(`${uri}/${id}`, {
    method: 'DELETE'
  })
    .then(() => getItems())
    .catch(error => console.error('Unable to delete item.', error));
}

const updateItem = () => {
  const itemId = document.getElementById('edit-id').value;
  fetch(`${uri}/${itemId}`)
    .then(response => response.json())
    .then(data => {
      const autorId = data.data[0].id
      const item = {
        id: parseInt(autorId, 10),
        email: document.getElementById('edit-email').value.trim(),
        contrasena: document.getElementById('edit-password').value.trim(),
        pseudonimo: document.getElementById('edit-username').value.trim()
      }
      fetch(`${uri}/${autorId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));
    })
      .catch(error => console.error('Unable to get item.', error))
  closeInput();
}

const displayEditForm = (id) => {
  const item = autores.find(item => item.id === id);
  document.getElementById('edit-id').value = item.id;
  document.getElementById('edit-email').value = item.email;
  document.getElementById('edit-password').value = item.contrasena;
  document.getElementById('edit-username').value = item.pseudonimo;
  document.getElementById('editForm').style.display = 'block';
}

function closeInput() {
  document.getElementById('editForm').style.display = 'none';
}

const _displayData = (data) => {
  console.log(data)
  const tBody = document.getElementById('todos');
  tBody.innerHTML = '';
  const button = document.createElement('button');
  data.forEach((autor) => {

    let editButton = button.cloneNode(false);
    editButton.innerText = 'Edit';
    editButton.setAttribute('onclick', `displayEditForm(${autor.id})`);

    let deleteButton = button.cloneNode(false);
    deleteButton.innerText = 'Delete';
    deleteButton.setAttribute('onclick', `deleteItem(${autor.id})`);

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    let idNode = document.createTextNode(autor.id);
    td1.appendChild(idNode)

    let td2 = tr.insertCell(1);
    let emailNode = document.createTextNode(autor.email);
    td2.appendChild(emailNode)

    let td3 = tr.insertCell(2);
    let usernameNode = document.createTextNode(autor.pseudonimo);
    td3.appendChild(usernameNode)

    let td4 = tr.insertCell(3);
    td4.appendChild(editButton);

    let td5 = tr.insertCell(4);
    td5.appendChild(deleteButton); 

  });

  autores = data
}



