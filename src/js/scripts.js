window.onload = loadData;
let data;
function loadData() {
  fetch('./test.json').then(promise => { return promise.json(); })
    .then(json => {
      data = json;
      f();

    })

}
function f() {
  let a = document.getElementsByClassName('name');
  a[0].innerHTML = data['name'];
  display_general()
  create_categories();
}

function display_general() {
  let body = document.getElementsByTagName("body")[0];
  body.style.backgroundColor = "#" + data['accentColorSecondary'];
  body.style.color = "#" + data['accentColor'];
  var icon = document.createElement("link");
  let someotherURL = data['icon'].file.url;
  icon.setAttribute('href', someotherURL);
  icon.setAttribute('rel', ' shortcut icon');
  let head = document.getElementsByTagName("head")[0];
  head.appendChild(icon);
  let description = document.getElementsByClassName('description')[0];
  description.innerHTML = data['description'];
  // display_items();
}

function create_categories() {
  if (data['enable_multiple_lists'] == true) {
    let categories = data['categories'];
    //сортую категорії
    categories.sort(function (a, b) {
      return a.positionNumber - b.positionNumber;
    });  
    //вивожу таби з категоріями
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].active == true) {
        let para = document.createElement("button");
        para.innerHTML = categories[i].name;
        let tab = document.getElementsByClassName('tab');
        let elem = tab[0].appendChild(para);
        para.addEventListener("click", function () { display_items(categories[i]); });
      }
    }
  }
  else{
    display_items();
    let tab = document.getElementsByClassName('tab')[0];
    tab.style.display = "none";
  }
}
function display_items(categorie) {

  //видаляю попередні елементи
  let e = document.getElementsByClassName('list_of_items')[0];
  if (e.hasChildNodes()) {
    while (e.firstChild) {
      e.removeChild(e.firstChild)
    }
  }

  if (categorie == undefined)
  {
    console.log("така ");
    let items_of_category = [];
    items_of_category = data['items'];
        //сортую items певної категорії
        items_of_category.sort(function (a, b) {
          return a.position - b.position;
        });
    
        items_of_category.forEach(element => {
          let div = document.getElementsByClassName('list_of_items')[0];
          let imgURL = element.gallery_images[0].url;
          let item = document.createElement("div");
          item.classList.add("item");
          item.addEventListener("click", function () { display_modal(element); });
          let img = document.createElement("img");
          img.classList.add("img_item");
          img.setAttribute('src', imgURL);
          let text_item = document.createElement("div");
          text_item.classList.add("text_item");
          let title = document.createElement("p");
          title.classList.add("title");
          title.innerHTML = element.title;
          let item_description = document.createElement("p");
          item_description.classList.add("item_description");
          item_description.innerHTML = element.description;
          div.appendChild(item);
          item.appendChild(img);
          item.appendChild(text_item);
          text_item.appendChild(title);
          text_item.appendChild(item_description);
        });
  }

  else {
    //вибираю items певної категорії
    let items_of_category = [];

    data['items'].forEach(element => {
      if (categorie.items.includes(element.id)) {
        items_of_category.push(element)
      }
    });

    //сортую items певної категорії
    items_of_category.sort(function (a, b) {
      return a.position - b.position;
    });

    items_of_category.forEach(element => {
      let div = document.getElementsByClassName('list_of_items')[0];
      let imgURL = element.gallery_images[0].url;
      let item = document.createElement("div");
      item.classList.add("item");
      item.addEventListener("click", function () { display_modal(element); });
      let img = document.createElement("img");
      img.classList.add("img_item");
      img.setAttribute('src', imgURL);
      let text_item = document.createElement("div");
      text_item.classList.add("text_item");
      let title = document.createElement("p");
      title.classList.add("title");
      title.innerHTML = element.title;
      let item_description = document.createElement("p");
      item_description.classList.add("item_description");
      item_description.innerHTML = element.description;
      div.appendChild(item);
      item.appendChild(img);
      item.appendChild(text_item);
      text_item.appendChild(title);
      text_item.appendChild(item_description);
    });
  }
}

function display_modal(element) {

  //очищаю модальне вікно
  let e = document.getElementsByClassName('my')[0];
  if (e.hasChildNodes()) {
    while (e.firstChild) {
      e.removeChild(e.firstChild)
    }
  }

  let modal = document.getElementById("myModal");
  modal.style.display = "block";
  let span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  }
  let modal_content = document.getElementsByClassName("my")[0];

  //додаємо title
  let item_title = document.createElement("p");
  item_title.classList.add("item_title");
  item_title.innerHTML = element.title;
  modal_content.appendChild(item_title);

  //додаємо слайдер
  let slider = document.createElement("div");
  slider.classList.add("slider");
  element.gallery_images.forEach(one_image => {
    let img = document.createElement("img");
    img.classList.add("mySlides");
    let imgURL = one_image.url;
    img.setAttribute('src', imgURL);
    slider.appendChild(img);
  });
  let cursor = document.createElement("div");
  cursor.classList.add("cursor");
  let w_left = document.createElement("div");
  w_left.classList.add("w3-left");
  w_left.innerHTML = "&#10094";
  let w_right = document.createElement("div");
  w_right.classList.add("w3-right");
  w_right.innerHTML = "&#10095";
  if (element.gallery_images.length > 1) {
    cursor.appendChild(w_left);
    cursor.appendChild(w_right);
    slider.appendChild(cursor);
    w_left.setAttribute('onclick', "plusDivs(-1)");
    w_right.setAttribute('onclick', "plusDivs(1)");
  }
  modal_content.appendChild(slider);
  slideIndex = 1;
  showDivs(1);

  //Виводжу long_description з клікабельними ссилками
  let arrey = element.long_description;
  let reg = /https:\/\/[\w.\/#]+/g;
  var myArray = reg.exec(arrey);
  let a = "<a href=\"" + myArray + "\">" + myArray + "</a>"
  var newString = arrey.replace(reg, a);
  let long_description = document.createElement("pre");
  long_description.classList.add("item_long_description");
  long_description.innerHTML = newString;
  modal_content.appendChild(long_description);

  //вивожу відео з youtube у випадку якщо воно є
  if (element.videoUrl != null && element.videoTitle != null) {
    let videoUrl = element.videoUrl;

    //let reg = /^(https:\/\/www.youtube.com\/)[\w.\/#]+/g;
    let b = "embed/";
    let reg = /https:\/\/www.youtube.com\/watch\?v=/g;
    var newString = videoUrl.replace(reg, b);
    //var myArray = reg.exec(newStringl);
    let Stringer = "https://www.youtube.com/"+newString;
    console.log(Stringer);

    let video = document.createElement("iframe");
    video.classList.add("video");
    video.setAttribute('src', Stringer);
    modal_content.appendChild(video);
  }

}

