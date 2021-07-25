function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function onClickUnitTest(questionId, input) {
    const jsCode = editor.getValue();

    try {
        eval(jsCode);
        eval(input);
    } catch(err) {
        document.getElementById("unit-tests-result").innerHTML = err;
        return;
    }

    fetch(`/question/${questionId}/unit-test`, {
        method: 'POST',
        body: JSON.stringify({jsCode}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json()) 
      .then(response => {
          if (typeof response === 'string') {
              document.getElementById("unit-tests-result").innerHTML = response;
          } else {
              document.getElementById("unit-tests-result").innerHTML = parseResult(response);
          }
      })
      .catch(err => {
          console.log(err);
      });
}

const parseResult = (data) => {
    if (typeof data === 'string') {
        return data;
    }

    let unitTestData = '<ul>';
    data.forEach(test => {
        const className = (test.isPassed) ? 'green' : 'red';
        unitTestData += `<li class="${className}">`;
        unitTestData += test.isPassed ? '<span>&#10004;</span>': '<span>&#10006;</span>';
        unitTestData += `<div>${test.data.desc}`;
        if (!test.isPassed) {
            unitTestData += `<div class="unit-test-expected">Error: Expected '${test.result}' to be '${test.data.output}'</div>`;
        }
        unitTestData += '</div>';
    });
    unitTestData += '</ul>';
    return unitTestData;
}