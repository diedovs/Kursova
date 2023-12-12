async function loginStart() {
  let loginForm = document.querySelector("div.login");
  let errorForm = document.querySelector("div.login .errors");
  let lInput = loginForm.querySelector('input[name="login"]');
  let pInput = loginForm.querySelector('input[name="passphrase"]');
  let login = lInput.value;
  if (!login) {
    lInput.classList.add("error");
  }
  let passphrase = pInput.value;
  if (!passphrase) {
    pInput.classList.add("error");
  }
  if (!login || !passphrase) {
    return false;
  }
  let response = await httpRequest("GET", `${HOST}/api/login`, {
    params: { login: login, password: passphrase },
  });
  if (response.status == 401) {
    errorForm.style.bottom = "-80px";
    setTimeout(() => {
      errorForm.style.bottom = 0;
    }, 5000);
  } else if (response.status == 200) {
    document.getElementById("login_submit").setAttribute("disabled", true);
    let ret = response.json();
    setCookie("token", ret.token.Token, ret.token.Expires);
    window.location = "/admin.html";
  }
}

async function createGroup(data) {
  let response = await httpRequest("POST", `${HOST}/api/triggers`, {
    headers: { Authentication: getCookie("token") },
    params: { action: "create_category" },
    body: JSON.stringify({
      Name: data,
    }),
  });
}
/* WARNING!! 1 time usage only! */
const ___migrateGroups___ = function () {
  let groups = [
    // "Ребра",
    // "До ребер",
    // "Страви з коптильні",
    // "Страви на грилі",
    // "Перші страви",
    // "Десерти",
    // "Дитяче меню",
    // "Напої",
    // "Фреші",
    // "Води",
    // "Вина",
    // "Пиво",
    // "Алкогольні напої",
    // "Алкогольні коктейлі",
    // "Кава та чай",
    "Додатки",
  ];
  groups.forEach((item) => {
    createGroup(item);
  });
};

async function requestItems(id, parent) {
  let groupID = isNaN(parseInt(id, 10)) ? -1 : parseInt(id, 10);
  if (groupID > 0) {
    let response = await httpRequest("GET", `${HOST}/api/shop_items`, {
      params: { full: true, pager: false, category_id: groupID },
    });
    if (response.status == 200) {
      for (let index = 0; index < response.json().data.items.length; index++) {
        const element = response.json().data.items[index];
        parent.append(htmlToElement(drawItemBlock(element)));
      }
    }
  } else {
    // sliders
    let response = await httpRequest("GET", `${HOST}/api/slider_items`, {
      params: { full: true, pager: false, parent_id: groupID },
    });
    if (response.status == 200) {
      for (let index = 0; index < response.json().data.items.length; index++) {
        const element = response.json().data.items[index];
        parent.append(htmlToElement(drawItemSliderBlock(element)));
      }
    }
  }
}
async function requestGroups() {
  let mainHolder = document.querySelector("section.admin div.admin__inner");
  let groupContainer = mainHolder.querySelector("ul.group-list");
  let groupTabs = mainHolder.querySelector("div.panel");

  let response = await httpRequest("GET", `${HOST}/api/shop_categorys`, {});
  if (response.status == 200) {
    for (let n = 0; n < response.json().data.length; n++) {
      const item = response.json().data[n];
      /*
				<li class="group-list__item active" data-button="ribs"><a >Ребра</a></li>
			*/
      groupContainer.innerHTML += `<li class="group-list__item${
        n === 0 ? " active" : ""
      }" data-button="${item.ID}" onclick="javascript:groupSwitch(this)">
																		<a href="javascript:;">${item.Name}</a>
																	</li>`;
      /*
				<div class="panel__group group show" data-group="ribs">
					<div class="group__title">
						<p>Ребра</p>
					</div>
					<div class="group__items"> 
						<button class="add-item"><SVG></button>
					</div>
				</div>
			*/
      let group = htmlToElement(`<div class="panel__group group${
        n === 0 ? " show" : ""
      }" data-group="${item.ID}">
																	<div class="group__title"><p>${item.Name}</p></div>
																	<div class="group__items"><button class="add-item" onclick="javascript:addItem(this,'item')">${drawSVG(
                                    "add",
                                    "#000000"
                                  )}</button></div>
																</div>`);
      groupTabs.append(group);
    }
    groupContainer.innerHTML += `<li class="disabled">&nbsp</li><li class="group-list__item" data-button="slider" onclick="javascript:groupSwitch(this)">
																	<a href="javascript:;">Слайдер</a>
																</li>`;
    let groupSlider =
      htmlToElement(`<div class="panel__group group" data-group="slider">
																			<div class="group__title"><p>Слайдер</p></div>
																			<div class="group__items"><button class="add-item slider" onclick="javascript:addItem(this,'slider')">${drawSVG(
                                        "add",
                                        "#000000"
                                      )}</button></div>
																		</div>`);
    groupTabs.append(groupSlider);
  }
}

const groupSwitch = function (elem) {
  let groupID = elem.getAttribute("data-button");

  let mainHolder = document.querySelector("section.admin div.admin__inner");
  let groupContainer = mainHolder.querySelector("ul.group-list");
  let groupTabs = mainHolder.querySelector("div.panel");

  if (!elem.classList.contains("active")) {
    groupContainer
      .querySelector("li.group-list__item.active")
      .classList.remove("active");
    elem.classList.add("active");

    groupTabs
      .querySelector("div.panel__group.group.show")
      .classList.remove("show");
    groupTabs
      .querySelector(`div.panel__group.group[data-group="${groupID}"]`)
      .classList.add("show");
  }
};

const drawItemBlock = function (
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
		<div class="item">
			<div class="stage edit-item">
				<div class="side image">
					<div class="box_image">
						<label class="file_upload" style="--img-pre:url(https://api.ribsandfire.com/images/c8/10/c8109a1111b24ae4b300a8bd4149911c.jpeg)">
							<input type="file">
								<i class="ico upload">${drawSVG('ico-upload','#000')}</i>
						</label>
					</div>
				</div>
				<div class="side text">
					<input type="hidden" name="ID">
					<input type="text" name="Name" placeholder="Назва">
					<input type="text" name="Descr" placeholder="Опис">
					<input class="noarrow" type="number" name="Weight" placeholder="Вага (грам)">
					<input class="noarrow" type="number" name="Price" placeholder="Ціна">
					<input class="noarrow" type="number" name="Pos" placeholder="Позиція">
					<input type="checkbox" name="Active" check="Активний" nocheck="Прихований">
				</div>
				<div class="buttons">
					<a class="bttn save" href="javascript:;">Зберегти${drawSVG('ico-save','#000')}</a>
					<a class="bttn cancel" href="javascript:;">Відмінити${drawSVG('ico-cancel','#000')}</a>
				</div>
			</div>
			<div class="stage result-item" data-id="" data-active="1">
				<div class="side image">
					<div class="preview" style="--img-pre:url(https://api.ribsandfire.com/images/c8/10/c8109a1111b24ae4b300a8bd4149911c.jpeg)"></div>
				</div>
				<div class="side text">
					<p class="item-title">Title</p>
					<p class="item-descr">Descr</p>
					<div class="fe-items"><span class="item-price" alt=" грн">101.10</span><span class="item-weight" alt=" г">300</span></div>
				</div>
				<div class="buttons">
					<a class="bttn edit" href="javascript:;">Редагувати${drawSVG('ico-edit','#000')}</a>
					<a class="bttn delete" href="javascript:;">Видалити${drawSVG('ico-delete','#000')}</a></div>
			</div>
		</div>
	*/
  let item = `<div class="item" data-id="${object.ID}"${
    object.Active ? " active=1" : " active=0"
  }>
								<div class="stage edit-item">
									<div class="side image">
										<div class="box_image">
											<label class="file_upload" style="--img-pre:url(${HOST}${object.Photo})">
												<input type="file" name="image" onchange="javascript:uploadImage(this)">
													<i class="ico upload">${drawSVG("ico-upload", "#000")}</i>
											</label>
										</div>
									</div>
									<div class="side text">
										<input type="hidden" name="ID" value="${object.ID}">
										<input type="hidden" name="Photo" value="${object.Photo}">
                    <p>Назва:</p>
										<input type="text" name="Name" placeholder="Назва" value="${object.Name}">
                    <p>Опис:</p>
                    <input type="text" name="Descr" placeholder="Опис" value="${
                      object.Descr
                    }">
                    <p>Вага:</p>
                    <input class="noarrow" type="text" name="Weight" placeholder="Вага (грам)" value="${
                      object.Weight
                    }">
                    <p>Ціна:</p>
										<input class="noarrow" type="number" name="Price" placeholder="Ціна" value="${
                      object.Price
                    }">
										<!-- <input class="noarrow" type="number" name="Pos" placeholder="Позиція" value="${
                      object.Pos
                    }"> -->
										<input type="checkbox" name="Active" check="Активний" nocheck="Прихований" ${
                      object.Active ? " checked" : ""
                    }>
									</div>
									<div class="buttons">
										<a class="bttn save" onclick="javascript:saveEdit(this.closest('.item'))">Зберегти${drawSVG(
                      "ico-save",
                      "#000"
                    )}</a>
										<a class="bttn cancel" onclick="javascript:cancelEdit(this.closest('.item'))">Відмінити${drawSVG(
                      "ico-cancel",
                      "#000"
                    )}</a>
									</div>
								</div>
								<div class="stage result-item">
									<div class="side image" image="${object.Photo}">
										<div class="preview" style="--img-pre:url(${HOST}${object.Photo})"></div>
									</div>
									<div class="side text">
										<p class="item-title">${object.Name}</p>
										<p class="item-descr">${object.Descr}</p>
										<div class="fe-items"><span class="item-price" alt=" грн">${
                      object.Price
                    }</span><span class="item-weight" alt=" г">${
    object.Weight
  }</span></div>
									</div>
									<div class="buttons">
										<a class="bttn edit" onclick="javascript:editItem(this.closest('.item'))">Редагувати${drawSVG(
                      "ico-edit",
                      "#000"
                    )}</a>
										<a class="bttn delete" onclick="javascript:removeAdminItem(this.closest('.item'),'item')">Видалити${drawSVG(
                      "ico-delete",
                      "#000"
                    )}</a></div>
								</div>
							</div>`;
  return item;
};

const drawItemSliderBlock = function (
  object = {
    ID: 0,
    Min: "",
    Orig: "",
    Pos: 0,
    Active: false,
  }
) {
  let item = `<div class="item" data-id="${object.ID}"${
    object.Active ? " active=1" : " active=0"
  }>
								<div class="stage edit-item">
									<div class="side image">
										<div class="box_image">
                      <p>Рекомендоване розширення фото: 1400х500</p>
											<label class="file_upload" style="--img-pre:url(${HOST}${object.Min})">
												<input type="file" name="image" onchange="javascript:uploadImage(this)">
													<i class="ico upload">${drawSVG("ico-upload", "#000")}</i>
											</label>
										</div>
									</div>
									<div class="side text">
										<input type="hidden" name="ID" value="${object.ID}">
										<input type="hidden" name="Photo" value="${object.Min}">
										<input type="hidden" name="Orig" value="${object.Orig}">
										<input type="checkbox" name="Active" check="Активний" nocheck="Прихований" ${
                      object.Active ? " checked" : ""
                    }>
									</div>
									<div class="buttons">
										<a class="bttn save" onclick="javascript:saveSliderEdit(this.closest('.item'))">Зберегти${drawSVG(
                      "ico-save",
                      "#000"
                    )}</a>
										<a class="bttn cancel" onclick="javascript:cancelSliderEdit(this.closest('.item'))">Відмінити${drawSVG(
                      "ico-cancel",
                      "#000"
                    )}</a>
									</div>
								</div>
								<div class="stage result-item">
									<div class="side image" image="${object.Min}">
										<div class="preview" style="--img-pre:url(${HOST}${object.Min})"></div>
									</div>
									<div class="buttons">
										<a class="bttn edit" onclick="javascript:editItem(this.closest('.item'))">Редагувати${drawSVG(
                      "ico-edit",
                      "#000"
                    )}</a>
										<a class="bttn delete" onclick="javascript:removeAdminItem(this.closest('.item'), 'slider')">Видалити${drawSVG(
                      "ico-delete",
                      "#000"
                    )}</a>
									</div>
								</div>
							</div>`;
  return item;
};

const editItem = function (item) {
  item.querySelector("div.stage.edit-item").show();
  item.querySelector("div.stage.result-item").hide();
};

const cancelEdit = function (item) {
  let stageResult = item.querySelector("div.stage.result-item");
  let stageEdit = item.querySelector("div.stage.edit-item");
  let image = stageResult.querySelector(".side.image").getAttribute("image");
  let name = stageResult.querySelector("p.item-title").innerHTML;
  let descr = stageResult.querySelector("p.item-descr").innerHTML;
  let price = parseFloat(
    stageResult.querySelector("span.item-price").innerHTML
  );
  let weight = parseInt(
    stageResult.querySelector("span.item-weight").innerHTML,
    10
  );
  stageEdit.hide();
  stageResult.show();
  stageEdit.querySelector(
    "label.file_upload"
  ).style = `--img-pre:url(https://api.ribsandfire.com${image})`;
  stageEdit.querySelector('input[name="Photo"]').value = image;
  stageEdit.querySelector('input[name="Name"]').value = name;
  stageEdit.querySelector('input[name="Descr"]').value = descr;
  stageEdit.querySelector('input[name="Weight"]').value = weight;
  stageEdit.querySelector('input[name="Price"]').value = price;
};

const cancelSliderEdit = function (item) {
  let stageResult = item.querySelector("div.stage.result-item");
  let stageEdit = item.querySelector("div.stage.edit-item");
  let image = stageResult.querySelector(".side.image").getAttribute("image");
  stageEdit.hide();
  stageResult.show();
  stageEdit.querySelector(
    "label.file_upload"
  ).style = `--img-pre:url(https://api.ribsandfire.com${image})`;
  stageEdit.querySelector('input[name="Photo"]').value = image;
};

async function upload(formData) {
  try {
    const response = await fetch(`${HOST}/api/image`, {
      method: "PUT",
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        // "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // "Content-Type": "multipart/form-data"
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        JSON.stringify({ data: result, status: response.status })
      );
    }
    return { data: result, status: response.status };
  } catch (error) {
    return error;
  }
}

const uploadImage = function (element) {
  let label = element.closest("label.file_upload");
  let input = label
    .closest(".stage.edit-item")
    .querySelector('input[name="Photo"]');
  let data = element.value;
  let mime = data.substring(data.lastIndexOf(".") + 1).toLowerCase();
  if (
    element.files &&
    element.files[0] &&
    (mime == "png" || mime == "jpeg" || mime == "jpg")
  ) {
    var formData = new FormData();
    formData.append("image", element.files[0]);
    upload(formData).then((ret) => {
      if (ret.status == 200) {
        /*
					"data": {
						"header": {...},
						"imageName": "a4f956baaa3c45dc92d37cdae54f8cd6.jpeg",
						"imageUrl": {
								"min": "/images/a4/f9/a4f956baaa3c45dc92d37cdae54f8cd6.jpeg",
								"orig": "/images/a4/a4f956baaa3c45dc92d37cdae54f8cd6.jpeg"
						},
						"size": 3681930
					},
					"message": "image uploaded successfully"
				*/
        let orig = ret.data.data.imageUrl.orig;
        let min = ret.data.data.imageUrl.min;
        label.style = `--img-pre:url(${HOST}${min})`;
        input.value = min;
      } else {
        console.log({
          fire: "all-fucked",
          i: JSON.parse(ret.message),
        });
        /*
					{
						"data": {
							"message": "image save error -> imaging: unsupported image format"
						},
						"status": 500
					}
				*/
      }
    });
  } else {
    alert("invalid format");
  }
};

const saveEdit = function (item) {
  let stageResult = item.querySelector("div.stage.result-item");
  let stageEdit = item.querySelector("div.stage.edit-item");
  let collect = {
    ID: parseInt(stageEdit.querySelector('input[name="ID"]').value, 10),
    Photo: stageEdit.querySelector('input[name="Photo"]').value,
    Name: stageEdit.querySelector('input[name="Name"]').value,
    Descr: stageEdit.querySelector('input[name="Descr"]').value,

    // Weight: parseInt(stageEdit.querySelector('input[name="Weight"]').value, 10),
    Weight: stageEdit.querySelector('input[name="Weight"]').value,
    Price: parseFloat(stageEdit.querySelector('input[name="Price"]').value),
    // Pos: parseInt(stageEdit.querySelector('input[name="Pos"]').value, 10),
    Active: stageEdit.querySelector('input[name="Active"]').checked,
    CategoryID: parseInt(
      item.closest("div.panel__group").getAttribute("data-group"),
      10
    ),
  };
  collect.ID = isNaN(collect.ID) ? 0 : collect.ID;

  doRequest({
    pre_auth: true,
    method: "post",
    url: `${HOST}/api/triggers`,
    params: {
      action: collect.ID === 0 ? "create_shop_item" : "update_shop_item",
    },
    body: JSON.stringify(collect),
  }).then((result) => {
    let object = result.body.data;
    item.setAttribute("data-id", object.ID);
    stageEdit.querySelector('input[name="ID"]').value = object.ID;
    stageResult
      .querySelector(".side.image")
      .setAttribute("image", object.Photo);
    stageResult.querySelector(
      ".side.image .preview"
    ).style = `--img-pre:url(${HOST}${object.Photo})`;
    stageResult.querySelector(".side.text p.item-title").innerHTML =
      object.Name;
    stageResult.querySelector(".side.text p.item-descr").innerHTML =
      object.Descr;
    stageResult.querySelector(
      ".side.text div.fe-items span.item-price"
    ).innerHTML = object.Price;
    stageResult.querySelector(
      ".side.text div.fe-items span.item-weight"
    ).innerHTML = object.Weight;
    item.setAttribute("active", object.Active ? 1 : 0);

    item.querySelector("div.stage.result-item").show();
    item.querySelector("div.stage.edit-item").hide();
    console.log(object.Weight);
    console.log(result);
  });
};

const saveSliderEdit = function (item) {
  let stageResult = item.querySelector("div.stage.result-item");
  let stageEdit = item.querySelector("div.stage.edit-item");
  let collect = {
    ID: parseInt(stageEdit.querySelector('input[name="ID"]').value, 10),
    Min: stageEdit.querySelector('input[name="Photo"]').value,
    Orig: stageEdit.querySelector('input[name="Orig"]').value,
    // Pos: parseInt(stageEdit.querySelector('input[name="Pos"]').value, 10),
    Active: stageEdit.querySelector('input[name="Active"]').checked,
    ParentID: 1,
  };
  collect.ID = isNaN(collect.ID) ? 0 : collect.ID;

  doRequest({
    pre_auth: true,
    method: "post",
    url: `${HOST}/api/triggers`,
    params: {
      action: collect.ID === 0 ? "create_slider_item" : "update_slider_item",
    },
    body: JSON.stringify(collect),
  }).then((result) => {
    let object = result.body.data;
    item.setAttribute("data-id", object.ID);
    stageEdit.querySelector('input[name="ID"]').value = object.ID;
    stageEdit.querySelector('input[name="Photo"]').value = object.Min;
    stageEdit.querySelector('input[name="Orig"]').value = object.Orig;
    stageResult.querySelector(".side.image").setAttribute("image", object.Min);
    stageResult.querySelector(
      ".side.image .preview"
    ).style = `--img-pre:url(${HOST}${object.Min})`;
    item.setAttribute("active", object.Active ? 1 : 0);

    item.querySelector("div.stage.result-item").show();
    item.querySelector("div.stage.edit-item").hide();
  });
};

const removeAdminItem = function (item, type) {
  let ID = item.getAttribute("data-id");
  let action = type === "slider" ? "slider_item_delete" : "shop_item_delete";
  console.log(action, type, type === "slider");
  confirm(type === "slider" ? "Видалити елемент" : "Видалити продукт?").then(
    (response) => {
      if (response) {
        doRequest({
          pre_auth: true,
          method: "post",
          url: `${HOST}/api/triggers`,
          params: { action: action, id: ID },
        }).then((result) => {
          let is_deleted = result.body.message.includes("deleted");
          if (!is_deleted) {
            console.error(result.body.error);
          } else {
            item.remove();
          }
        });
      }
    }
  );
};

const addItem = function (target, type) {
  let blankItem;
  if (type === "slider") {
    blankItem = htmlToElement(drawItemSliderBlock());
  } else {
    blankItem = htmlToElement(drawItemBlock());
  }
  blankItem.querySelector("label.file_upload").style = "";
  blankItem.querySelector("div.stage.edit-item").show();
  blankItem.querySelector("div.stage.result-item").hide();
  console.log({
    target: target,
    item: blankItem,
    parent: target.closest("div.group__items"),
    sibling: target.closest("div.group__items").nextSibling,
  });
  target.parentNode.insertBefore(blankItem, target.nextSibling);
};
/* element movement */
function moveChoiceTo(element, direction) {
  let item = element.parentNode;
  let parent = item.parentNode;

  if (direction === -1 && item.previousElementSibling) {
    parent.insertBefore(item, item.previousElementSibling);
  } else if (direction === 1 && item.nextElementSibling) {
    parent.insertBefore(item, item.nextElementSibling.nextElementSibling);
  }
}
