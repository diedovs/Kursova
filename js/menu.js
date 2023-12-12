async function requestGroupsFront() {
  let mainHolder = document.querySelector("div.menu__inner.menu-list");

  doRequest({
    pre_auth: false,
    method: "get",
    url: `${HOST}/api/shop_categorys`,
  }).then((ret) => {
    console.log(ret);
    if (ret.status == 200) {
      for (let index = 0; index < ret.body.data.length; index++) {
        const item = ret.body.data[index];
        /*
          <li class="group-list__item active" data-button="ribs"><a >Ребра</a></li>
        */
        mainHolder.innerHTML += `<div class="menu-group group${
          index === 0 ? " first-group" : ""
        }" id="${item.ID}">
          <div class="container">
            <h2 class="group__title">${item.Name}</h2>
            <div class="group__items"></div>
            <button class="show-more">Показати більше</button>
            <button class="show-less hidden">Приховати</button>
          </div>
        </div>`;
      }
    }
    fullfillGroups();
  });
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const clearFrontpage = () => {
  document.querySelector("div.menu__inner.menu-list").innerHTML = "";
};

const fullfillGroups = function () {
  let mainHolder = document.querySelector("div.menu__inner.menu-list");
  let groups = mainHolder.querySelectorAll("div.menu-group.group");
  // змінити на for
  for (let i = 0; i < groups.length; i++) {
    const element = groups[i];
    let container = element.querySelector(".container");
    let ID = element.getAttribute("id");
    requestItemsFront({
      id: ID,
      parent: container.querySelector("div.group__items"),
      all: false,
    });
  }
  setGroupHeight();
};

async function requestItemsFront(
  { id, parent, all, page } = { id: 0, parent: null, all: false, page: 0 }
) {
  doRequest({
    pre_auth: false,
    method: "get",
    url: `${HOST}/api/shop_items`,
    params: {
      full: false,
      pager: true,
      category_id: parseInt(id, 10),
      per_page: 1000,
      page: page,
    },
  }).then((ret) => {
    if ((ret.status == 200) & (parent !== null)) {
      for (let index = 0; index < ret.body.data.items.length; index++) {
        const element = ret.body.data.items[index];
        parent.append(htmlToElement(drawItemBlockFront(element)));
      }
    }
  });
}

const drawItemBlockFront = function (
  object = {
    ID: 0,
    Name: "",
    Descr: "",
    Photo: "",
    Weight: 0,
    Price: 0,
    Pos: 0,
    Active: false,
  }
) {
  /*
		<div class="item" data-id="0101">
      <div class="item__image"> <img src="images/menu.png" alt=""></div>
      <div class="item__descr">
        <div class="item__title" data-weight="200">Ребра на вогні </div>
        <div class="item__subtitle">Незабутній смак, хрустка кірочка та божественний аромат</div>
        <div class="item__footer"> 
          <div class="price" data-price="229">229</div>
          <div class="add-to-cart">Обрати </div>
        </div>
      </div>
    </div>
	*/
  let item = `<div class="item" data-id="${object.ID}">
                <div class="item__image" style="background-image: url('${HOST}${object.Photo}')"> 
                </div>
                <div class="item__descr">
                  <div class="item__title" data-weight="${object.Weight}">${object.Name}</div>
                  <div class="item__subtitle">${object.Descr}</div>
                  <div class="item__footer"> 
                    <div class="price" data-price="${object.Price}">${object.Price}</div>
                    <div class="add-to-cart" onclick="javascript:addToCart(this.closest('.item'))">Обрати</div>
                  </div>
                </div>
              </div>`;
  return item;
};

function addToCart(el) {
  let itemImage = el.querySelector(".item__image").getAttribute("style");
  let itemTitle = el.querySelector(".item__title");
  let itemSubtitle = el.querySelector(".item__subtitle");
  let itemPrice = el.querySelector(".price");
  let productID = el.getAttribute("data-id");

  document.querySelector(".menu-popup").classList.add("flex");

  menuPopup.querySelector(".popup__image").setAttribute("style", itemImage);
  menuPopup.querySelector(".item__title p").innerHTML = itemTitle.innerHTML;
  menuPopup.querySelector(".popup__content").setAttribute("data-id", productID);
  menuPopup.querySelector(".item__weight p").innerHTML =
    itemTitle.getAttribute("data-weight");
  menuPopup.querySelector(".item__subtitle p").innerHTML =
    itemSubtitle.innerHTML;
  menuPopup.querySelector(".item__price p").innerHTML = itemPrice.innerText;
  menuPopup
    .querySelector(".item__price p")
    .setAttribute("data-price", itemPrice.innerHTML);
  console.log(itemImage);
}

const requestSliderItems = async () => {
  let response = await httpRequest("GET", `${HOST}/api/slider_items`, {
    params: { full: false, pager: false, parent_id: 1 },
  });
  if (response.status == 200) {
    for (let index = 0; index < response.json().data.items.length; index++) {
      const element = response.json().data.items[index];
      let parent = document.querySelector(".swiper-wrapper");
      parent.append(
        htmlToElement(
          `<div class="swiper-slide main-slide" style="background-image: url(${HOST}${element.Min})">
          
          </div>`
        )
      );
    }
  }
};
