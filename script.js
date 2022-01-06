const baseurl = "https://www.anapioficeandfire.com/api/";


async function getBooks() {
  try {
    let books;
    let local = await JSON.parse(window.localStorage.getItem("books"));
    if (local && local.length !== 0) {
      books = local;
    } else {
      books = await fetchBook();
    }
    books.forEach(async (book, index) => {
      constructBook(book, index);
      
      book.characters.forEach((char) => {
        constructCharater(char, index);
      });
    });
    window.localStorage.setItem("books", JSON.stringify(books));
    console.log(books);
  } catch (err) {
    console.log(err);
  }
}

function getCharaters(url, charObj) {
  let num = 0;
  let chars = [];
  for (let i = 0; i < url.length; i++) {
    const char = charObj[url[i]];
    if (num === 5) {
      break;
    }
    if (char.name !== "" && char.gender !== "" && char.culture !== "") {
      chars.push(char);
      num++;
    }
  }
  return chars;
}

async function fetchBook() {
  try {
    let charobj = await fetchCharactersAll();
    const books = await getData(baseurl + "books");

    books.forEach(async (book) => {
      book.characters = await getCharaters(book.characters, charobj);
    });
    return books;
  } catch (err) {
    console.log(err);
  }
}

async function fetchCharactersAll() {
  let page = 1;
  let pagesize = 50;
  let limit = 15;
  const charObj = {};
  let urls = [];
  while (page <= limit) {
    urls.push(baseurl + `characters?page=${page}&pageSize=${pagesize}`);
    page++;
  }
  try {
    let results = await Promise.all(urls.map((url) => fetch(url)));

    results.forEach((result) => {
      result
        .json()
        .then((characters) => {
          characters.forEach((char) => {
            charObj[char.url] = char;
          });
        })
        .catch((err) => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }
  console.log(charObj);
  return charObj;
}


async function getData(URL) {
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  }

getBooks();


function constructBook(book, index) {
  document.querySelector(".books").innerHTML += ` 
  <div class="book-container">
  <div class="head">Book Specs</div>
  <div class="book-info">
    <div class="info">
      <span class="label">Name </span>:<span class="detail"
        >${book.name}</span
      >
    </div>
    <div class="info">
      <span class="label">ISBN </span>:<span class="detail"
        >${book.isbn}</span
      >
    </div>
    <div class="info">
      <span class="label">Number of Pages </span>:<span class="detail">${book.numberOfPages}</span>
    </div>
    <div class="info">
      <span class="label">Authors</span>:<span class="detail"
        >${book.authors[0]}</span
      >
    </div>
    <div class="info">
      <span class="label">Publisher Name</span>:<span class="detail"
        >${book.publisher}</span
      >
    </div>
    <div class="info">
      <span class="label">Released Date </span>:<span class="detail"
        >${new Date(book.released).toDateString()}</span
      >
    </div>
  </div>
  <div class="head">Charaters</div>
  <div class="charater-container" id="key${index}"></div>
</div>`;
}

function constructCharater(character, index) {
  document.querySelector(
    `#key${index}`
  ).innerHTML += `<div class="charater-info">
      <div class="info">
        <span class="label">Name </span>:<span class="detail"
          >${character.name}</span
        >
      </div>
      <div class="info">
      <span class="label">Gender </span>:<span class="detail"
        >${character.gender}</span
      >
    </div>
      <div class="info">
          <span class="label">Culture </span>:<span class="detail"
            >${character.culture}</span
          >
        </div>`;
}

