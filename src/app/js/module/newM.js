import debounce from "./debounce";

export function myFFF() {

  console.log('very worksc!')

  const createEl = (tag, opts) => {
    const el = document.createElement(tag)
    // перебираем ключи объекта и записывает соответствующие свойства в элемент
    for (const key in opts) {
      el[key] = opts[key]
    }
    // возвращаем готовый элемент
    return el
  }

  function showSearched(arr) {
    const searchedList = createEl('ul', {className: 'search__list'})
    for(const el of arr) {
      const listItem = createEl('li', {className: 'search__list-item', textContent: el[0]})
      // el.forEach(e => {
      //   listItem.prepend(createEl('p', {textContent: e}))
      // })
      searchedList.appendChild(listItem)
    }
    document.querySelector('.search').appendChild(searchedList)
  }


  async function getReps(inpValue) {
    console.log('in getReps')
    const myQuery = `q=${inpValue}&sort=stars&order=desc&per_page=5`;
    // const myQuery = "q=tetris+language:assembly&sort=stars&order=desc";

    if (inpValue !== '') {
      const response = await fetch(
        `https://api.github.com/search/repositories?${myQuery}`
      );
      const reps = await response.json();
      console.log('in getReps result', reps)
      // reps.then(() => {
        if(reps.total_count === 0) {
          // show str: "Nothing was found" +/-
        } else {

          showSearched(getSearched(reps.items))
        }
      // })
      return reps
    }


  }

  // function logInp(inpVal) {
  //   console.log('inLogInp')
  //   setTimeout(() => {
  //     console.log('trying to emulate fetch')
  //   }, 1000)
  // }

  function getSearched(reps) {
    return reps.reduce((list, cur) => {
      list.push([cur.name, cur.owner.login, cur.stargazers_count])
      return list
    }, [])
  }

  (function() {

    const inp = document.querySelector('.search__inp')
// обернули в debounce
    const debounceTime = 3000
    const debouncedLoginp = debounce(getReps, debounceTime)


    inp.addEventListener('input', async (e) => {
      const reps = await debouncedLoginp(inp.value)
      // createAutocomplit(reps)
    })
      // фия запроса
      // debounce(getReps(inp.value), debounceTime)
      // .then(data => {
      // inp.value = '' // если подтверждение
      // console.log('in Listener result', data)
      // })



  })()

}
