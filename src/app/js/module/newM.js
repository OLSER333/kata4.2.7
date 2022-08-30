import debounce from "./debounce";

export function myFFF() {

  console.log('very worksc!')

  function cleanInp() {
    document.querySelector('.search__inp').value = ''
  }

  function getSelectedNode() {
    // const selectedList = createEl('ul', {className: 'selected__list'})
    const selectedItem = createEl('li', {className: 'selected__item'})
    const selectedTxt = createEl('div', {className: 'selected__txt'})
    const selectedBtn = createEl('button', {className: 'selected__del-btn'})
    // selectedList.appendChild(selectedItem)
    selectedItem.appendChild(selectedTxt)
    selectedItem.appendChild(selectedBtn)
    return selectedItem
  }

  const createEl = (tag, opts, fuForEvListener = null) => {
    const el = document.createElement(tag)
    // перебираем ключи объекта и записывает соответствующие свойства в элемент
    for (const key in opts) {
      el[key] = opts[key]
    }

    // if (fuForEvListener !== null) {
    //   el.addEventListener('click', () => {
    //     fuForEvListener()
    //   })
    // }

    // возвращаем готовый элемент
    return el
  }

  //
  // function sendToSelected(el) {
  //   console.log('el', el)
  //   console.log(el.srcElement)
  //   const moveingEl = el.srcElement
  //   (moveingEl)
  // }

  function showSearched(arr) {
    // arr - массив из [name, owner, stars] * 5

    //формирую searchList
    const searchedList = createEl('ul', {className: 'search__list'})
    for (const el of arr) {
      const listItem = createEl('li', {className: 'search__list-item', textContent: el[0]})
      searchedList.appendChild(listItem)
    }

    //вешаю кликер для переноса элементов в selected
    searchedList.addEventListener('click', (e) => {
      console.log('searched el ', e)
      let selectedList = document.querySelector('.selected__list')
      if(selectedList === null) { // не существ listNode
        selectedList = createEl('ul', {className: 'selected__list'})
        document.querySelector('.search').after(selectedList)
      }

      arr.forEach(el => {
        if (e.target.innerText === el[0]) {
          console.log(el)
          const emptyReadyItem = getSelectedNode()
          const forSelectedItem = emptyReadyItem.firstElementChild
          // emptyReadyItem.appendChild(forSelectedItem)
          // for (const itm of el) {
            forSelectedItem.appendChild(createEl('p', {textContent: `Name: ${el[0]}` }))
            forSelectedItem.appendChild(createEl('p', {textContent: `Owner: ${el[1]}`}))
            forSelectedItem.appendChild(createEl('p', {textContent: `Stars: ${el[2]}`}))
          // }
          // emptyReadyItem.appendChild(forSelectedItem)
          selectedList.appendChild(emptyReadyItem)
        }
      })

      // e.target.remove()
      searchedList.remove()
      cleanInp()

    })
    document.querySelector('.search').appendChild(searchedList)
    // const selectedList = document.querySelector('.selected__list')
    // selectedList.appendChild


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
      if (reps.total_count === 0) {
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

  (function () {

    const inp = document.querySelector('.search__inp')
// обернули в debounce
    const debounceTime = 500
    const debouncedLoginp = debounce(getReps, debounceTime)


    inp.addEventListener('input', async (e) => {
      //удаляю предыдущий автокомплит
      const selectedList = document.querySelector('.search__list')
      if (selectedList) selectedList.remove()

      // запрос
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
