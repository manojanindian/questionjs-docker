
function redirectToCMSLogin() {
  window.location = '/cms/login';
  return;
}

function updateQuestion() {
  let question = {};
  try {

    question = editor.get();
    
  } catch(err) {
    alert('Incorrect json');
  }
  
  const questionId = $('#question-id').val();
  // Remove ids
  delete question._id;
  question.unitTests.forEach(test => {
    delete test._id;
  })

  const token = getCookie('authToken');
  fetch(`/api/question/${questionId}/update`, {
    method: 'PUT',
    body: JSON.stringify(question),
    headers: {"auth-token": token, "Content-type": "application/json; charset=UTF-8"}
  })
  .then(response => response.json()) 
  .then(response => {
    window.location.reload();
  })
  .catch(err => {
    
  });

}

function addQuestion() {
  let questionJSON = {};
  try {
    questionJSON = editor.get();
  } catch(err) {
    alert('Incorrect json');
  }

  const {question, functionName, unitTests} = questionJSON;

  if (!question || !functionName || !unitTests || !unitTests.length) {
		alert('Invalid Question');
		return;
	}

  const token = getCookie('authToken');
  fetch(`/api/question/add`, {
    method: 'POST',
    body: JSON.stringify(questionJSON),
    headers: {"auth-token": token, "Content-type": "application/json; charset=UTF-8"}
  })
  .then(response => response.json()) 
  .then(response => {
    window.location.reload();
  })
  .catch(err => {
    
  });

}


/**
 * validate user on page load
 */
 function isLoggedIn() {
  const token = getCookie('authToken');
  if (!token) {
    redirectToCMSLogin();
  }
  fetch('/admin/me', {
    method: 'GET',
    headers: {"auth-token": token, "Content-type": "application/json; charset=UTF-8"}
  })
  .then(response => response.json()) 
  .then(response => {
    if (response.error) {
      redirectToCMSLogin();
    }
  })
  .catch(err => {
    console.log();
    redirectToCMSLogin();
  });
};

/**
 * login to cms
 */
 function login(e) {
  e.preventDefault();
  const form = document.querySelector(".login-form");
  const email = form.elements.uname.value;
  const password = form.elements.psw.value;
  fetch('/admin/login', {
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .then(response => response.json()) 
  .then(response => {
      setCookie('authToken', response.token, 7);
      window.location = "/cms";
  })
  .catch(err => console.log(err));
}

/**
 * Change question status
 */
 function onClickPublish(id, question, publish) {
  const accepted = confirm(`Do you want ${(publish) ? 'UnPublish': 'Publish'} question \n\n${id}.\n${question}`);
  if (accepted) {
    const token = getCookie('authToken');
    fetch(`/api/question/${id}/visibility`, {
      method: 'PATCH',
      body: JSON.stringify({published: !publish}),
      headers: {"auth-token": token, "Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(response => {

      window.location.reload();
    })
    .catch(err => console.log(err));
      
  }
}
/**
 * view question structure
 */
function onClickView(id) {
  const token = getCookie('authToken');
  fetch(`/api/question/${id}`, {
    method: 'GET',
    headers: {"auth-token": token, "Content-type": "application/json; charset=UTF-8"}
  })
  .then(response => response.json()) 
  .then(response => {

   console.log(response);
   const {functionName} = response;
   $('#submit-btn').text('Update Question');
    $('#question-action').val('update');
    $('#json-input').val(JSON.stringify(response));
    $('#question-id').val(response.questionId);
    editor.load(getJson());
    openModel();
  })
  .catch(err => console.log(err));
}

/**
 * remove question
 */
function onClickRemove(id, question) {
    const accepted = confirm(`Do you want delete question \n\n${id}.\n${question}`);
    if (accepted) {

      
    }
}

function onClickAddQuestion() {
  $('#submit-btn').text('Add Question');
    $('#question-action').val('add');
    const defaultText = JSON.stringify({question: "", functionName:"", unitTests:[] })
    $('#json-input').val(defaultText);
    $('#question-id').val('');
    editor.load(getJson());
    openModel();
}

/**
 * Sign out
 */
function onClickSignOut() {
  eraseCookie('authToken');
  redirectToCMSLogin();
}


function closeModel() {
  $('.modal').removeClass('open-model');
}

function openModel() {
  $('.modal').addClass('open-model');
}