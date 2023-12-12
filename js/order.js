// import {IMask} from 'imask.js';
// import axios from "axios.js";

window.callbackLocalStorage = {
  setItem(key, value) {
    return Promise.resolve().then(function () {
      localStorage.setItem(key, value);
      console.log("set promice");
    });
  },
  getItem(key) {
    return Promise.resolve().then(function () {
      console.log("get promice");
      return localStorage.getItem(key);
    });
  },
};

let cartButton = document.querySelector(".cart-button .price");
const cartCahgeQuantityEvent = function (type, id) {
  let itemsContainer = document.querySelector("section.cart div.cart__items");
  let total = parseFloat(
    document
      .querySelector("section.cart div.cart__total")
      .querySelector("div.total__price p")
      .innerHTML.split(" ")[0],
    32
  );
  let workItem = itemsContainer.querySelector(`.item[data-id='${id}']`);
  let price = parseFloat(
    workItem.querySelector(".item__price").getAttribute("data-price"),
    32
  );
  let quantity = parseFloat(workItem.querySelector("p.quantity").innerHTML, 32);
  let totalCount = parseInt(workItem.querySelector(".item__count p").innerHTML);

  let totalPrice = price * quantity;

  let fullPrice = parseFloat(
    document
      .querySelector("section.cart div.cart__total")
      .querySelector("div.total__price p")
      .innerHTML.split(" ")[0],
    32
  );

  let cartObj = JSON.parse(window.localStorage.getItem("cart"));
  if (type === "+") {
    totalCount += 1;
    totalPrice += price;
    fullPrice += price;
    cartObj[id].quantity = totalCount;
    cartObj[id].totalPrice = totalCount * cartObj[id].price;

    cartButton.innerHTML = fullPrice.toFixed(2);
    window.localStorage.setItem("price", fullPrice.toFixed(2));
  } else if (type === "-") {
    if (totalCount <= 1) {
      return;
    } else {
      totalCount -= 1;
      totalPrice -= price;
      fullPrice -= price;
      cartObj[id].quantity = totalCount;
      cartObj[id].totalPrice = totalCount * cartObj[id].price;

      window.localStorage.setItem("price", fullPrice.toFixed(2));
      cartButton.innerHTML = fullPrice.toFixed(2);
    }
  }

  window.localStorage.setItem("cart", JSON.stringify(cartObj));
  workItem.querySelector(".item__count p").innerHTML = totalCount;
  workItem.querySelector(".item__price p").innerHTML = `${totalPrice.toFixed(
    2
  )} грн`;
  document
    .querySelector("section.cart div.cart__total")
    .querySelector("div.total__price p").innerHTML = `${fullPrice.toFixed(
    2
  )} грн`;
};

const removeItem = function (element, id) {
  let stored = JSON.parse(window.localStorage.getItem("cart"));
  let price = 0;
  delete stored[id];
  if (Object.keys(stored).length === 0) {
    document
      .querySelector("div.form div.stage.process button.scop-frame")
      .remove();
  }
  window.localStorage.setItem("cart", JSON.stringify(stored));
  for (const [_, el] of Object.entries(stored)) {
    price += el.totalPrice;
  }
  document.querySelector(
    "div.cart__total .total__price p"
  ).innerHTML = `${price.toFixed(2)} грн`;
  document.querySelector("a.cart-button p.price").innerHTML = price.toFixed(2);
  window.localStorage.setItem("price", price.toFixed(2));
  element.remove();
};

var mask;

const maskMe = function (element) {
  var maskOptions = {
    mask: "+{38}(000)000-00-00",
    lazy: true,
  };
  mask = new IMask(element, maskOptions);

  // finished: mask.unmaskedValue.length === 12;
  // value: mask.value;
};

const sendOrder = function (element) {
  let next = element.nextElementSibling;
  /*
		id="delivery" Доставка
		id="self" Самовиніс
		id="cashpay" Оплата готівкою
		id="cardpay" Оплата кур'єру терміналом

		input[name="address" Адреса
		input[name="numb" Будинок
		input[name="entrance" Під`їзд
		input[name="phone"
		input[name="name"
		textarea[name="comment" Комендар до замовлення
	*/
  let reqFields = element.querySelectorAll("input[required]");
  reqFields.forEach((current) => {
    current.value === ""
      ? current.classList.add("error")
      : current.classList.remove("error");
  });
  if (mask === undefined) {
    element.querySelector('input[name="phone"]').classList.add("error");
    return false;
  }
  let phone = mask.unmaskedValue.length === 12 ? mask.value : "";

  if (phone === "") {
    element.querySelector('input[name="phone"]').classList.add("error");
  }

  let entrance = element.querySelector('input[name="entrance"]').value;
  let delivery = element.querySelector("input#delivery").checked ? 1 : 2;
  let payment = element.querySelector("input#cashpay").checked ? 1 : 2;
  let cart = [];
  for (const [_, value] of Object.entries(
    JSON.parse(window.localStorage.getItem("cart"))
  )) {
    cart.push({ ID: value.id, Quantity: value.quantity });
  }

  let collect = {
    Name: element.querySelector('input[name="name"]').value,
    Phone: mask.value,
    Address: `${element.querySelector('input[name="address"]').value}, буд ${
      element.querySelector('input[name="numb"]').value
    }${entrance !== "" ? ", п." + entrance : ""}`,
    Comment: element.querySelector('textarea[name="comment"]').value,
    Delivery: delivery,
    Payment: payment,
    Cart: cart,
  };
  if (delivery === 2) {
    delete collect.Address;
  }

  doRequest({
    method: "post",
    url: `${HOST}/api/triggers`,
    params: { action: "create_order" },
    body: JSON.stringify(collect),
  }).then((result) => {
    // show result
    element.style.top = "-650px";
    next.style.top = "-650px";
    element.querySelector("button.scop-frame").remove();
    window.localStorage.removeItem("cart");
    window.localStorage.removeItem("price");
    // remove buttons
    document.querySelector("button.cart-clear").remove();
    document.querySelectorAll("div.cart__items .item").forEach((element) => {
      element.querySelector("a.item__clear").remove();
      element.querySelector("a.minus").remove();
      element.querySelector("a.plus").remove();
    });
    // process tg reaction
    let data = result.body.data;
    triggerBot({
      ID: data.ID,
      ClientName: data.Client.Name,
      ClientPhone: data.Client.Phone,
      Comment: data.Client.Comment,
      Delivery: data.Delivery,
      Payment: data.Payment,
      Address: data.Client.Address,
      Sum: data.Sum,
      Cart: data.Cart,
    });
  });
};

const bot = new Bot(
  "6003290143:AAEqO45_30M6lM3Q8Z2Gbp13ugj2OTV39QM",
  "-1001886203944"
);
const voc = {
  Delivery: {
    1: "Доставка в межах міста",
    2: "Самовиніс",
  },
  Payment: {
    1: "Оплата готівкою",
    2: "Оплата кур`єру терміналом",
  },
};

const triggerBot = function (
  order = {
    ID: 0,
    ClientName: "",
    ClientPhone: "",
    Comment: "",
    Delivery: 0,
    Payment: 0,
    Address: "",
    Sum: 0,
    Cart: [],
  }
) {
  /*
		"Delivery": 1, //  1 - Доставка в межах міста | 2 - Самовиніс
    "Payment": 2,  // 1 - Оплата готівкою | 2 - Оплата кур'єру терміналом
	*/
  let message = `<b>Нова заявка на сайті:</b>
Номер заявки: <b>${order.ID}</b>
Замовник: <b>${order.ClientName}</b>
Номер телефону: <a href="tel:+${order.ClientPhone.replace(/\D/g, "")}">${
    order.ClientPhone
  }</a>
За адресою: ${order.Address}
Комендар до замовлення: <b>${order.Comment}</b>
Замовлення на суму: ${order.Sum} грн\n`;
  for (let index = 0; index < order.Cart.length; index++) {
    const element = order.Cart[index];
    message += `- ${element.Name} ${element.Quantity} * ${element.Price} - ${element.Total} грн.\n`;
    // console.log(element);
  }
  message += `(${voc.Delivery[order.Delivery]}, ${voc.Payment[order.Payment]})`;
  bot
    .sendMessage({
      text: encodeURIComponent(message),
      parseMode: "html",
      silent: false,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
