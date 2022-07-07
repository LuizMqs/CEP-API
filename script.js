function validator() {
  let cep = document.querySelector("#text").value;
  let number = "";

  for (let i = 0; i < cep.length; i++) {
    if (cep[i] == Number(cep[i])) {
      if (number.length <= 8) {
        if (number.length == 5) {
          number += "-";
        }
        number += cep[i];
      }
    }
  }

  document.querySelector("#text").value = number;

  if (document.querySelector("#text").value.length == 9) {
    document.querySelector("#consult").disabled = false;
  } else {
    document.querySelector("#consult").disabled = true;
  }
}

const requestAPI = (cep) => {
  return fetch(`https://cep.awesomeapi.com.br/json/${cep}`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
};

async function showData() {
  document.querySelector("body").style.cursor = "wait";
  document.querySelector("body").style.pointerEvents = "none";

  let cep = document.querySelector("#text").value.replace("-", "");
  let localization = await requestAPI(cep);

  if (localization.state == undefined) {
    document.querySelector("#result").innerHTML = `
        <p>CEP inválido!</p>
    `;
  } else {
    document.querySelector("#result").style.padding = "30px";

    document.querySelector("#result").innerHTML = `
          <p>${localization.state} - ${localization.city}</p>
          <p>${localization.district}</p>
          <p>${localization.address_name}</p>
          <p>${localization.lat}</p>
          <p>${localization.lng}</p>
          <button id="show-map">Exibir mapa</button>
      `;

    document
      .querySelector("#show-map")
      .addEventListener("click", () => map(localization));
  }

  document.querySelector("body").style.cursor = "default";
  document.querySelector("body").style.pointerEvents = "auto";
}

function map(localization) {
  document.querySelector("body").style.cursor = "wait";
  document.querySelector("body").style.pointerEvents = "none";

  document.querySelector("#map").innerHTML = `
        <iframe src="https://www.google.com/maps?api=1&q=${localization.lat}%2C${localization.lng}&output=embed"></iframe>
    `;

  document.querySelector("body").style.cursor = "default";
  document.querySelector("body").style.pointerEvents = "auto";
}

document.querySelector("#text").addEventListener("keyup", validator);
document.querySelector("#consult").addEventListener("click", async () => {
  await showData();
});
