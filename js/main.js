function toggle_class(element, class_name) {
  if (element.classList.contains(class_name)) {
    element.classList.remove(class_name);
  } else {
    element.classList.add(class_name);
  }
}

// mobile-menu
if (
  typeof document.querySelector(".header__burger") !== "undefined" &&
  document.querySelector(".header__burger") !== null
) {
  document
    .querySelector(".header__burger")
    .addEventListener("click", function () {
      toggle_class(document.querySelector(".mobile-menu"), "open");
      toggle_class(this, "active");
      toggle_class(document.querySelector("body"), "hidden");
    });
}

// desktop-menu
document.querySelectorAll(".header__link").forEach((el) => {
  el.addEventListener("click", function () {
    document.querySelectorAll(".header__link").forEach((item) => {
      item.classList.remove("active");
    });
    if (!this.classList.contains("active")) {
      this.classList.add("active");
    }
  });
});

document.querySelectorAll(".mobile-menu__link").forEach((el) => {
  el.addEventListener("click", function () {
    toggle_class(document.querySelector(".mobile-menu"), "open");
    toggle_class(document.querySelector(".header__burger"), "active");
    toggle_class(document.querySelector("body"), "hidden");
  });
});

window.addEventListener("scroll", function () {
  document.querySelectorAll(".header__link").forEach((item) => {
    item.classList.remove("active");
  });
  if (window.scrollY !== 0 && window.innerWidth > 768) {
    document.querySelector(".header")?.classList.add("scrolled");
  } else {
    document.querySelector(".header")?.classList.remove("scrolled");
  }
});

//

let menuItems = document.querySelectorAll(".menu-list .item");

let menuPopup = document.querySelector(".menu-popup");
menuItems.forEach((el) => {
  el.querySelector(".add-to-cart").addEventListener("click", function () {
    document.querySelector("body").classList.add("hidden");
    let itemImage = el.querySelector("img").getAttribute("src");
    let itemTitle = el.querySelector(".item__title");
    let itemSubtitle = el.querySelector(".item__subtitle");
    let itemPrice = el.querySelector(".price");
    let productID = el.getAttribute("data-id");

    document.querySelector(".menu-popup").classList.add("flex");

    menuPopup.querySelector(".popup__image img").setAttribute("src", itemImage);
    menuPopup.querySelector(".item__title p").innerHTML = itemTitle.innerHTML;
    menuPopup
      .querySelector(".popup__content")
      .setAttribute("data-id", productID);
    menuPopup.querySelector(".item__weight p").innerHTML =
      itemTitle.getAttribute("data-weight");
    menuPopup.querySelector(".item__subtitle p").innerHTML =
      itemSubtitle.innerHTML;
    menuPopup.querySelector(".item__price p").innerHTML = itemPrice.innerText;
    menuPopup
      .querySelector(".item__price p")
      .setAttribute("data-price", itemPrice.innerHTML);
  });
});

let count = document.querySelector(".quantity");
let cartCount = 1;

if (typeof menuPopup !== "undefined" && menuPopup !== null) {
  menuPopup.querySelector("a.minus").addEventListener("click", function () {
    if (cartCount == 1) {
      return;
    } else {
      cartCount -= 1;
      count.innerHTML = cartCount;

      menuPopup.querySelector(".item__price p").innerHTML =
        menuPopup.querySelector(".item__price p").getAttribute("data-price") *
        cartCount;
    }
  });

  menuPopup.querySelector("a.plus").addEventListener("click", function () {
    cartCount += 1;
    count.innerHTML = cartCount;
    menuPopup.querySelector(".item__price p").innerHTML =
      menuPopup.querySelector(".item__price p").getAttribute("data-price") *
      cartCount;
  });
}
if (
  window.localStorage.getItem("price") != null &&
  typeof document.querySelector("header.menu p.price") !== "undefined"
) {
  if (document.querySelector("header.menu p.price") !== null) {
    document.querySelector("header.menu p.price").innerHTML =
      window.localStorage.getItem("price");
  }
}

let addToCartButton = document.querySelector(".item__add-to-cart");

if (typeof addToCartButton !== "undefined" && addToCartButton !== null) {
  document
    .querySelector(".item__add-to-cart")
    .addEventListener("click", function () {
      let cartItem = {};

      cartItem.id = parseInt(
        menuPopup.querySelector(".popup__content").getAttribute("data-id"),
        10
      );

      cartItem.image = menuPopup
        .querySelector(".popup__image")
        .getAttribute("style");
      cartItem.title = menuPopup.querySelector(".item__title p").innerHTML;
      cartItem.weight = menuPopup.querySelector(".item__weight p").innerHTML;
      cartItem.subtitle =
        menuPopup.querySelector(".item__subtitle p").innerHTML;
      cartItem.totalPrice = parseFloat(
        menuPopup.querySelector(".item__price p").innerHTML,
        32
      );
      cartItem.price = parseFloat(
        menuPopup.querySelector(".item__price p").getAttribute("data-price"),
        32
      );

      cartItem.quantity = parseInt(
        menuPopup.querySelector(".item__count.count .quantity").innerHTML,
        10
      );

      let cartObj = JSON.parse(window.localStorage.getItem("cart"));

      document.querySelector("body").classList.remove("hidden");
      document.querySelector(".menu-popup").classList.remove("flex");

      if (cartObj !== null) {
        let el = cartObj[cartItem.id];

        if (el === undefined) {
          cartObj[cartItem.id] = cartItem;
        } else {
          cartObj[cartItem.id].quantity += cartItem.quantity;
          cartObj[cartItem.id].totalPrice += cartItem.totalPrice;
        }
      } else {
        cartObj = {};
        cartObj[cartItem.id] = cartItem;
      }

      window.localStorage.setItem("cart", JSON.stringify(cartObj));
      document.querySelector(".menu-popup .quantity").innerHTML = 1;
      cartCount = 1;

      let sum = 0;

      for (const [id, el] of Object.entries(cartObj)) {
        sum += el.totalPrice;
      }

      window.localStorage.setItem("price", sum.toFixed(2));
      let totalSum = window.localStorage.getItem("price");

      document.querySelector("header.menu p.price").innerHTML = totalSum;
      let buttonWidth = document.querySelector(".cart-button").offsetWidth;
      document.querySelector(
        "header.menu p.price"
      ).style.left = `calc(50% - ${buttonWidth}px`;
    });

  document
    .querySelector(".item__close-btn")
    .addEventListener("click", function () {
      document.querySelector(".menu-popup").classList.remove("flex");
      document.querySelector("body").classList.remove("hidden");
      document.querySelector(".menu-popup .quantity").innerHTML = 1;
    });

  document.querySelector(".more-btn").addEventListener("click", function () {
    document.querySelector(".menu-list-container").classList.add("show");
  });
  document
    .querySelector(".menu-list-container")
    .addEventListener("click", function () {
      document.querySelector(".menu-list-container").classList.remove("show");
    });
}
// console.log(storage);

let modileDeliveryButton = document.querySelector(".mob-delivery-btn");
if (
  typeof modileDeliveryButton !== "undefined" &&
  modileDeliveryButton !== null
) {
  modileDeliveryButton.addEventListener("click", function () {
    // document.querySelector(".cart.menu-cart").classList.toggle("show-mob");
    document.querySelector(".agreement").classList.toggle("show-mob");
    document.querySelector("body").classList.toggle("hidden");
    document.querySelector(".header-menu-mob").classList.remove("show");
  });
}

let deliveryButton = document.querySelector(".delivery");
let backToCart = document.querySelector(".back-to-cart");
let mobileMenuBtn = document.querySelector(".mob-menu-btn");
if (typeof deliveryButton !== "undefined" && deliveryButton !== null) {
  deliveryButton.addEventListener("click", function () {
    document.querySelector(".agreement").classList.toggle("show");

    this.classList.remove("show");
    backToCart.classList.add("show");
  });
}

if (typeof backToCart !== "undefined" && backToCart !== null) {
  backToCart.addEventListener("click", function () {
    document.querySelector(".agreement").classList.toggle("show");
    deliveryButton.classList.add("show");
    this.classList.remove("show");
  });
}
if (typeof mobileMenuBtn !== "undefined" && mobileMenuBtn !== null) {
  mobileMenuBtn.addEventListener("click", function () {
    document.querySelector(".header-menu-mob").classList.toggle("show");
    document.querySelector(".agreement").classList.remove("show-mob");
  });
}

// HIDE HEADER WITH SCROLL
let hideMenu = document.querySelector(".hide-menu");

if (typeof hideMenu !== "undefined" && hideMenu !== null) {
  if (window.innerWidth > 768) {
    document.addEventListener("DOMContentLoaded", function () {
      var scrollPos = 0;
      window.addEventListener("scroll", function () {
        if (document.body.getBoundingClientRect().top > scrollPos) {
          document.querySelector(".hide-menu").classList.remove("top-hidden");
        } else {
          document.querySelector(".hide-menu").classList.add("top-hidden");
        }
        scrollPos = document.body.getBoundingClientRect().top;
      });
    });
  }
}

const setGroupHeight = function () {
  let groupItems = document.querySelectorAll(".menu-group");
  for (let i = 0; i < groupItems.length; i++) {
    const el = groupItems[i];
    let container = el.querySelector(".group__items");
    setTimeout(() => {
      let menuItem = document.querySelector(".menu .item");
      let items = container.querySelectorAll(".item");

      if (window.innerWidth < 992 && window.innerWidth > 768) {
        // console.log("992");
        if (items.length > 6) {
          container.style.height = menuItem.clientHeight * 2 + 20 + "px";
          container.style.overflow = "hidden";

          el.querySelector(".show-more").addEventListener("click", function () {
            container.style.height = 100 + "%";
            el.querySelector(".show-less").classList.remove("hidden");
            el.querySelector(".show-more").classList.add("hidden");
          });

          el.querySelector(".show-less").addEventListener("click", function () {
            container.style.height = menuItem.clientHeight * 2 + 20 + "px";
            el.querySelector(".show-less").classList.add("hidden");
            el.querySelector(".show-more").classList.remove("hidden");
          });
        } else {
          el.querySelector(".show-more").classList.add("hidden");
        }
      } else if (window.innerWidth < 768) {
        // console.log("768");
        if (items.length > 8) {
          container.style.height = menuItem.clientHeight * 8 + "px";
          container.style.overflow = "hidden";

          el.querySelector(".show-more").addEventListener("click", function () {
            container.style.height = 100 + "%";
            el.querySelector(".show-less").classList.remove("hidden");
            el.querySelector(".show-more").classList.add("hidden");
          });

          el.querySelector(".show-less").addEventListener("click", function () {
            container.style.height = menuItem.clientHeight * 8 + "px";
            el.querySelector(".show-less").classList.add("hidden");
            el.querySelector(".show-more").classList.remove("hidden");
          });
        } else {
          el.querySelector(".show-more").classList.add("hidden");
        }
      } else {
        // console.log("ELSE");
        if (items.length > 8) {
          container.style.height = menuItem.clientHeight * 2 + 20 + "px";
          container.style.overflow = "hidden";
          el.querySelector(".show-more").addEventListener("click", function () {
            container.style.height = 100 + "%";
            el.querySelector(".show-less").classList.remove("hidden");
            el.querySelector(".show-more").classList.add("hidden");
          });

          el.querySelector(".show-less").addEventListener("click", function () {
            container.style.height = menuItem.clientHeight * 2 + 20 + "px";
            el.querySelector(".show-less").classList.add("hidden");
            el.querySelector(".show-more").classList.remove("hidden");
          });
        } else {
          el.querySelector(".show-more").classList.add("hidden");
        }
      }
    }, 1000);
  }
};

let mobMenu = document.querySelector(".header-menu-mob");
if (typeof mobMenu !== "undefined" && mobMenu !== null) {
  let menuItems = mobMenu.querySelectorAll(".mob-menu");
  menuItems.forEach((el) => {
    el.addEventListener("click", function () {
      mobMenu.classList.remove("show");
    });
  });
}

let form = document.querySelector(".form");
if (typeof form !== "undefined" && form !== null) {
  let deliveryCheckbox = form.querySelector(".item-delivery");
  let selfCheckbox = form.querySelector(".item-self");

  deliveryCheckbox.addEventListener("click", function () {
    form.querySelectorAll(".address-input").forEach((el) => {
      // console.log(el);
      el.classList.add("show");
      form.querySelector(".card-pay").classList.remove("hidden");
    });
  });

  selfCheckbox.addEventListener("click", function () {
    form.querySelectorAll(".address-input").forEach((el) => {
      // console.log(el);
      el.classList.remove("show");
      form.querySelector(".card-pay").classList.add("hidden");
    });
  });
}

// CART PAGE

if (document.querySelector("section.cart_page") !== null) {
  let itemsContainer = document.querySelector("section.cart div.cart__items");
  itemsContainer.innerHTML = "";

  let cartStored = JSON.parse(window.localStorage.getItem("cart"));

  if (cartStored !== null) {
    let total = 0;
    for (const [id, el] of Object.entries(cartStored)) {
      let itemTMPL = `<div class="item" data-id="${el.id}"> 
        <div class="item__image" style="${el.image}">
        </div>
        <div class="item__title"> 
          <p>${el.title}</p>
          <p>${el.weight}г</p>
        </div>
        <div class="item__count"> <a class="minus" onclick="cartCahgeQuantityEvent('-', ${
          el.id
        })">-</a>
          <p class="quantity">${
            el.quantity
          }</p><a class="plus" onclick="cartCahgeQuantityEvent('+', ${
        el.id
      })">+</a>
        </div>
        <div class="item__price" data-price="${el.price}"> 
          <p>${el.quantity * el.price} грн</p>
        </div>
        <a class="item__clear" onclick="javascipt:removeItem(this.closest('div.item'), ${
          el.id
        })">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.913 1.02948L8.00002 6.94248L2.08702 1.02948C1.9448 0.899339 1.75785 0.829086 1.56513 0.833356C1.3724 0.837627 1.18875 0.916091 1.05244 1.0524C0.916126 1.18872 0.837662 1.37236 0.833392 1.56509C0.829121 1.75782 0.899374 1.94476 1.02952 2.08698L6.93952 7.99998L1.02802 13.9115C0.955794 13.9803 0.89806 14.0629 0.858209 14.1543C0.818357 14.2458 0.797191 14.3443 0.795956 14.4441C0.79472 14.5438 0.81344 14.6428 0.851014 14.7352C0.888589 14.8277 0.944259 14.9116 1.01475 14.9822C1.08525 15.0528 1.16914 15.1086 1.26151 15.1463C1.35388 15.184 1.45285 15.2029 1.55261 15.2018C1.65237 15.2007 1.7509 15.1797 1.84242 15.1399C1.93393 15.1002 2.01659 15.0426 2.08552 14.9705L8.00002 9.05898L13.913 14.972C14.0552 15.1021 14.2422 15.1724 14.4349 15.1681C14.6276 15.1638 14.8113 15.0854 14.9476 14.9491C15.0839 14.8127 15.1624 14.6291 15.1666 14.4364C15.1709 14.2436 15.1007 14.0567 14.9705 13.9145L9.05752 8.00148L14.9705 2.08698C15.0427 2.01815 15.1005 1.93558 15.1403 1.84412C15.1802 1.75266 15.2013 1.65416 15.2026 1.5544C15.2038 1.45464 15.1851 1.35564 15.1475 1.26323C15.1099 1.17081 15.0543 1.08683 14.9838 1.01624C14.9133 0.945642 14.8294 0.889852 14.737 0.852147C14.6447 0.814442 14.5457 0.795582 14.4459 0.796676C14.3462 0.79777 14.2476 0.818796 14.1561 0.858518C14.0646 0.89824 13.9819 0.955856 13.913 1.02798V1.02948Z" fill="white"></path>
          </svg>
        </a>
      </div>`;
      itemsContainer.innerHTML += itemTMPL;

      total += el.totalPrice;
    }
    let totalContainer = document.querySelector("section.cart div.cart__total");

    // ТУТ ЙОБАНИЙ ТОТАЛ ВСЬОГО НАХУЙ
    totalContainer.querySelector("div.total__price p").innerHTML =
      localStorage.getItem("price") + " грн";

    document.querySelector(".cart-clear").classList.add("show");
    document.querySelector(".cart__total").classList.add("show");
    document.querySelector(".form").classList.add("show");
    document.querySelector(".cart-empty").classList.add("hidden");
  }
  document.querySelector(".cart-clear").addEventListener("click", function () {
    window.localStorage.clear();
    location.reload();
  });
}

// admin

let adminContainer = document.querySelector(".admin");
if (typeof adminContainer !== "undefined" && adminContainer !== null) {
  let tabButtons = adminContainer.querySelectorAll(".group-list li");
  let tabsItems = adminContainer.querySelectorAll(".group");
  tabButtons.forEach((el) => {
    el.addEventListener("click", function () {
      tabButtons.forEach((el) => {
        el.classList.remove("active");
      });
      el.classList.add("active");
      adminContainer.querySelector(".group-list").classList.remove("show");

      let dataButton = el.getAttribute("data-button");
      tabsItems.forEach((el) => {
        el.classList.remove("show");
        let dataGroup = el.getAttribute("data-group");
        if (dataGroup == dataButton) {
          el.classList.add("show");
        }
      });
    });
  });
  // add new item
  tabsItems.forEach((el) => {
    el.querySelector(".add-item").addEventListener("click", function () {
      let newItem = document.createElement("div");
      newItem.classList.add("new-item");

      let newitemTitle = document.createElement("input");
      newitemTitle.type = "text";
      newitemTitle.placeholder = "Назва";

      let newitemSubtitle = document.createElement("input");
      newitemSubtitle.type = "text";
      newitemSubtitle.placeholder = "Опис";

      let newitemWeight = document.createElement("input");
      newitemWeight.type = "text";
      newitemWeight.placeholder = "Вага (грам)";

      let newitemPrice = document.createElement("input");
      newitemPrice.type = "number";
      newitemPrice.placeholder = "Ціна";

      let newitemImage = document.createElement("input");
      newitemImage.type = "file";

      let saveButton = document.createElement("button");
      let buttons = document.createElement("div");
      buttons.classList.add("buttons");

      let editButton = document.createElement("button");
      let deleteButton = document.createElement("button");
      saveButton.classList.add("save");
      editButton.classList.add("edit");
      deleteButton.classList.add("delete");

      let titleHolder = document.createElement("p");
      titleHolder.classList.add("item-title");
      let priceHolder = document.createElement("p");
      priceHolder.classList.add("item-price");

      saveButton.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M26 0H6a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6zm-6 2v3a1 1 0 1 0 2 0V2h1v7H9V2zm10 24a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2h1a4 4 0 0 1 4 4zM24 14H8a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V15a1 1 0 0 0-1-1zm-1 12H9V16h14zM12 20h8a1 1 0 0 0 0-2h-8a1 1 0 0 0 0 2zM12 24h8a1 1 0 0 0 0-2h-8a1 1 0 0 0 0 2z"/>
      </svg>`;

      editButton.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,11.5 C20,11.2238576 20.2238576,11 20.5,11 C20.7761424,11 21,11.2238576 21,11.5 L21,18.5000057 C21,19.8807175 19.8807119,21.0000057 18.5,21.0000057 L5.48612181,21.0000057 C4.10540994,21.0000057 2.98612181,19.8807175 2.98612181,18.5000057 L2.98612181,5.5 C2.98612181,4.11928813 4.10540994,3 5.48612181,3 L12.5,3 C12.7761424,3 13,3.22385763 13,3.5 C13,3.77614237 12.7761424,4 12.5,4 L5.48612181,4 C4.65769469,4 3.98612181,4.67157288 3.98612181,5.5 L3.98612181,18.5000057 C3.98612181,19.3284328 4.65769469,20.0000057 5.48612181,20.0000057 L18.5,20.0000057 C19.3284271,20.0000057 20,19.3284328 20,18.5000057 L20,11.5 Z M18.8535534,3.14644661 L20.8535534,5.14644661 C21.0488155,5.34170876 21.0488155,5.65829124 20.8535534,5.85355339 L12.8535534,13.8535534 C12.7597852,13.9473216 12.6326082,14 12.5,14 L10.5,14 C10.2238576,14 10,13.7761424 10,13.5 L10,11.5 C10,11.3673918 10.0526784,11.2402148 10.1464466,11.1464466 L18.1464466,3.14644661 C18.3417088,2.95118446 18.6582912,2.95118446 18.8535534,3.14644661 Z M18.5,4.20710678 L11,11.7071068 L11,13 L12.2928932,13 L19.7928932,5.5 L18.5,4.20710678 Z"/>
      </svg>`;
      deleteButton.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
      <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

      newItem.append(newitemTitle);
      newItem.append(newitemSubtitle);
      newItem.append(newitemWeight);
      newItem.append(newitemPrice);
      newItem.append(newitemImage);
      newItem.append(saveButton);
      newItem.append(titleHolder);
      newItem.append(priceHolder);

      newItem.append(buttons);
      buttons.append(editButton);
      buttons.append(deleteButton);

      el.querySelector(".group__items").prepend(newItem);

      saveButton.addEventListener("click", function () {
        this.closest(".new-item").classList.add("collapsed");
        titleHolder.innerHTML = newitemTitle.value;
        priceHolder.innerHTML = newitemPrice.value;
      });
      editButton.addEventListener("click", function () {
        this.closest(".new-item").classList.remove("collapsed");
      });
      deleteButton.addEventListener("click", function () {
        this.closest(".new-item").remove();
      });
    });
  });
  let mobileList = adminContainer.querySelector(".hamburger");
  mobileList.addEventListener("click", function () {
    adminContainer.querySelector(".group-list").classList.toggle("show");
  });
}
