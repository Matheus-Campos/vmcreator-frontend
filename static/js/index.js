function showMessage(message, status) {
  var msg = document.querySelector('span');

  if (!msg) {
    msg = document.createElement('span');
    document.querySelector('div.title-container').after(msg);
  }

  msg.className = status;
  msg.innerHTML = message;
}

function handleSubmit(e) {
  e.preventDefault();
  var inputs = document.querySelectorAll('input');
  var select = document.querySelector('select');

  var name = inputs[0].value;
  var cpu = inputs[1].value;
  var ram = inputs[2].value;
  var ip = inputs[3].value;

  try {
    ip = ip
      .split('.')
      .map((octet, index) => {
        var o = parseInt(octet);
        if (isNaN(o)) {
          throw new TypeError(`Octet ${index + 1} is not a number.`);
        }
        return o;
      })
      .join('.');
  } catch (err) {
    showMessage(err.message, 'failure');
    return;
  }

  if (select.value === 'GB') {
    ram = ram * 1024;
  }

  if (ram < 4) {
    showMessage('RAM must be greater than or equal to 4 MB.', 'failure');
    return;
  }

  var httpRequest = new XMLHttpRequest();
  httpRequest.open(
    'GET',
    `http://localhost:3333?cpu=${cpu}&ram=${ram}&ip=${ip}&name=${name}`,
    true
  );

  httpRequest.onreadystatechange = function(e) {
    if (this.readyState === 4) {
      if (this.status === 200) {
        showMessage('VM was created.', 'success');
      } else {
        showMessage('Failure on creating VM.', 'failure');
      }
    }
  };

  httpRequest.send();
}

function main() {
  var form = document.querySelector('form');

  form.onsubmit = handleSubmit;
}

main();
