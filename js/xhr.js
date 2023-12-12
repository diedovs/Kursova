let HttpResponse = function (xhr) {
  this.body = xhr.response;
  this.status = xhr.status;
  this.parser = new DOMParser();
};
HttpResponse.prototype.json = function () {
  return JSON.parse(this.body);
};
let HttpError = function (xhr) {
  this.body = xhr.response;
  this.status = xhr.status;
};
HttpError.prototype.toString = function () {
  let json = JSON.parse(this.body);
  return "[" + this.status + "] Error: " + json.error || json.errors.join(", ");
};
const doRequest = async function ({
  pre_auth,
  method,
  url,
  headers,
  params,
  body,
} = {}) {
  if (pre_auth) {
    headers = { Authentication: getCookie("token") };
  }
  if (!headers) {
    headers = {};
  }
  headers["Content-Type"] = "application/json";
  method = method.toUpperCase();
  try {
    const response = await fetch(
      `${url}${params !== {} ? "?" + new URLSearchParams(params) : ""}`,
      {
        method: method,
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        headers: headers,
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: body,
      }
    );
    const result = await response.json();
    if (!response.ok) {
      switch (response.status) {
        case 401:
          console.log({ has: true, error: 401 });
          break;
        case 500:
          console.log({ has: true, error: 500 });
          break;
        case 405:
          console.log({ has: true, error: 405 });
          break;
        case 502:
          console.log({ has: true, error: 502 });
          break;
        case 400:
          console.log({ has: true, error: 400 });
          break;
      }
      throw { body: result, status: response.status };
    }
    return { body: result, status: response.status };
  } catch (error) {
    return error;
  }
};
let httpRequest = function (
  method,
  url,
  { headers, params, body } = {},
  is_file
) {
  method = method.toUpperCase();

  let urlEncodedDataPairs = [],
    name;
  for (name in params) {
    urlEncodedDataPairs.push(
      encodeURIComponent(name) + "=" + encodeURIComponent(params[name])
    );
  }
  if (urlEncodedDataPairs.length > 0) {
    url = url + "?" + urlEncodedDataPairs.join("&");
  }

  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open(method, url, true);
  if (!is_file) {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  for (const key in headers) {
    if (Object.hasOwnProperty.call(headers, key)) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }

  xhr.send(body);

  return new Promise((resolve, reject) => {
    xhr.onload = function () {
      resolve(new HttpResponse(xhr));
    };

    xhr.onerror = function () {
      reject(new HttpError(xhr));
    };

    xhr.onabort = function () {
      reject(new HttpError(xhr));
    };
  });
};

const test = function () {
  doRequest({
    pre_auth: true,
    method: "post",
    url: "http://127.0.0.1:4456/api/triggers",
    // headers: {"Authentication":"NzQ2NTczNzQyMzMw"},
    params: { action: "update_shop_item" },
    body: JSON.stringify({
      ID: 11,
      Name: "Name-11",
      Price: 110.11,
      Descr: "Descr-11",
      Photo: "/images/c8/10/c8109a1111b24ae4b300a8bd4149911c.jpeg",
      Active: true,
      Pos: 0,
      CategoryID: 4,
    }),
  }).then((result) => {
    console.log(result);
  });
};

async function start() {
  let response = await httpRequest(
    "POST",
    "http://127.0.0.1:4456/api/triggers",
    {
      headers: { Authentication: "NzQ2NTczNzQyMzMw" },
      params: { action: "update_shop_item" },
      body: JSON.stringify({
        ID: 11,
        Name: "Name-11",
        Price: 110.11,
        Descr: "Descr-11",
        Photo: "/images/c8/10/c8109a1111b24ae4b300a8bd4149911c.jpeg",
        Active: true,
        Pos: 0,
      }),
    }
  );
  console.log(response.status);
  console.log(response.error);
  console.log(response.json());

  let response2 = await httpRequest(
    "GET",
    "http://127.0.0.1:4456/api/shop_items",
    {
      // headers: {"Authentication":"NzQ2NTczNzQyMzMw"},
      params: { full: true, pager: true, page: 2, per_page: 10 },
      // body: JSON.stringify({
      // 	"ID": 11,
      // 	"Name": "Name-11",
      // 	"Price": 110.11,
      // 	"Descr": "Descr-11",
      // 	"Photo": "/images/c8/10/c8109a1111b24ae4b300a8bd4149911c.jpeg",
      // 	"Active": true,
      // 	"Pos": 0
      // })
    }
  );
  console.log(response2.status);
  console.log(response2.error);
  console.log(response2.json());
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

window.confirm = function (message) {
  let overlay = htmlToElement(`<div class="overlay">
																<div class="box" style="transform: translateY(0%);"> 
																	<p class="key">${message}</p>
																	<div class="buttons">
																		<button class="yes">
																			Так ${drawSVG("ico-yes", "#129600")}
																		</button>
																		<button class="no">
																			Ні ${drawSVG("ico-no", "#ff0000")}
																		</button>
																	</div>
																</div>
															</div>`);
  // overlay.querySelector('button.yes').addEventListener('click', () => {	return true	});
  // overlay.querySelector('button.no').addEventListener('click', () => { return false	});
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.querySelector("div.box").style.transform = "translateY(0%)";
  }, 550);
  return new Promise(function (resolve, reject) {
    overlay.querySelector("button.yes").addEventListener("click", function () {
      resolve(true);
      overlay.querySelector("div.box").style.transform = "translateY(-110%)";
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 250);
    });
    overlay.querySelector("button.no").addEventListener("click", function () {
      resolve(false);
      overlay.querySelector("div.box").style.transform = "translateY(-110%)";
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 250);
    });
    overlay.addEventListener("click", function ({ target }) {
      if (target.classList.contains("overlay")) {
        console.log("overlay");
        resolve(false);
        overlay.querySelector("div.box").style.transform = "translateY(-110%)";
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 250);
      }
    });
  });
};

HTMLElement.prototype.hide = function () {
  return (this.style.display = "none");
};
HTMLElement.prototype.show = function () {
  return (this.style.display = "block");
};

// start();

// CONST
const HOST = "https://api.ribsandfire.com";
// const HOST = "http://127.0.0.1:4456";

// COOKIE

function setCookie(cname, cvalue, exdays) {
  const d = new Date(exdays);
  document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()}`;
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const bindEnterKey = function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("login_submit").click();
  }
};

const routeAdmin = function (selector) {
  // check selector for event listeners
  let hasElement =
    document.querySelectorAll(selector).length > 0 ? true : false;
  if (selector.indexOf("login") > 0) {
    /*
			Login page 
				- check session is expired
					true - do nothing
					false - forward admin
		*/
    if (hasElement) {
      // add Enter event
      document
        .querySelector('input[name="login"]')
        .addEventListener("keypress", bindEnterKey);
      document
        .querySelector('input[name="passphrase"]')
        .addEventListener("keypress", bindEnterKey);
    }
    let token = getCookie("token");
    if (!!token) {
      /*
				!'' === true (empty string)
				!!'' === false (mot empty string)
			*/
      window.location = "/admin.html";
    }
  } else if (selector.indexOf("admin") > 0) {
    /*
			Admin page 
				- check session is expired
					true - forward login
					false - do nothing
		*/
    let token = getCookie("token");
    if (!token) {
      /*
				!'' === true (empty string)
				!!'' === false (mot empty string)
			*/
      window.location = "/login.html";
    } else {
      requestGroups().then(function () {
        let mainHolder = document.querySelector(
          "section.admin div.admin__inner"
        );
        let groups = mainHolder.querySelectorAll(".panel__group.group");
        for (let index = 0; index < groups.length; index++) {
          const item = groups[index];
          requestItems(
            item.getAttribute("data-group"),
            item.querySelector(".group__items")
          );
        }
      });
    }
  }
};

const routeMenu = function (selector) {
  console.log(selector);
};
