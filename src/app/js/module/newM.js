import debounce from "./debounce";

export function myFFF() {


  //delete
  // const arr = [[1, 1, 1], [2, 2, 2], [3, 3, 3]]
  // let el = 3
  // console.log('ssmae myIncludes', myIncludes(arr, el))


  let selectedArr = []


  function showMessageError(message) {
    const errBlock = createEl('div', {className: 'error', textContent: `${message}`})
    const searchInp = document.querySelector('.search__form')
    searchInp.after(errBlock)

    setTimeout(() => {
      errBlock.remove()
    }, 2500)
  }

  function myIncludes(arr, addingEl) {
    if (arr.length === 0) return false
    for (let innerArrEl of arr) {
      // если innerArrEl имя === clicked имя
      console.log('innerArrEl', innerArrEl)
      if (innerArrEl[0] === addingEl) return true
    }
    return false
  }

  function getAddEl(arr, addingEl) {
    if (arr.length === 0) return null
    for (let innerArrEl of arr) {
      // если innerArrEl имя === clicked имя
      if (innerArrEl[0] === addingEl) return innerArrEl
    }
    return null
  }

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
    const addingEl = document.createElement(tag)
    // перебираем ключи объекта и записывает соответствующие свойства в элемент
    for (const key in opts) {
      addingEl[key] = opts[key]
    }

    // if (fuForEvListener !== null) {
    //   addingEl.addEventListener('click', () => {
    //     fuForEvListener()
    //   })
    // }

    // возвращаем готовый элемент
    return addingEl
  }

  function showSearched(arr) {
    // arr - массив из [name, owner, stars] * 5

    //формирую searchList
    const searchedList = createEl('ul', {className: 'search__list'})
    for (const addingEl of arr) {
      const listItem = createEl('li', {className: 'search__list-item', textContent: addingEl[0]})
      searchedList.appendChild(listItem)
    }
    document.querySelector('.search').appendChild(searchedList)

    //вешаю кликер для переноса элементов в selected
    searchedList.addEventListener('click', (e) => {

      // добавляю в данные
      if (myIncludes(selectedArr, e.target.innerText)) {
        return 'repeat of adding elem'
      }
      // else find this e elem
      const addingEl = getAddEl(arr, e.target.innerText)

      console.log('addEl', addingEl)
      // console.log('hmm', addingEl[0])


      console.log('searched addingEl ', e)
      let selectedList = document.querySelector('.selected__list')
      if (selectedList === null) { // не существ listNode
        selectedList = createEl('ul', {className: 'selected__list'})
        document.querySelector('.search').after(selectedList)
      }

      const emptyReadyItem = getSelectedNode()
      const forSelectedItem = emptyReadyItem.firstElementChild

      forSelectedItem.appendChild(createEl('p', {textContent: `Name: ${addingEl[0]}`}))
      forSelectedItem.appendChild(createEl('p', {textContent: `Owner: ${addingEl[1]}`}))
      forSelectedItem.appendChild(createEl('p', {textContent: `Stars: ${addingEl[2]}`}))
      // }
      // emptyReadyItem.appendChild(forSelectedItem)
      selectedList.appendChild(emptyReadyItem)


      document.querySelector('.selected__list').addEventListener('click', (listElem) => {
        // console.log('clicked', e)
        let deletingEl = listElem.target.closest('.selected__del-btn')
        console.log(deletingEl)
        if (deletingEl) {
          deletingEl.parentElement.remove()
          selectedArr = selectedArr.filter(item => {
            console.log("item", item, 'delEl', deletingEl.previousElementSibling.firstElementChild.textContent)
            return !deletingEl.previousElementSibling.firstElementChild.textContent === item
          }) // одинаковым с именем удаляемого - удалить
          // if (selectedArr.length === 0) {
          //   selectedList.remove()
          // }
        }
      })


      // e.target.remove()
      searchedList.remove()
      cleanInp()

    })

    // const selectedList = document.querySelector('.selected__list')
    // selectedList.appendChild


  }


  async function getReps(inpValue) {
    const myQuery = `q=${inpValue}&sort=stars&order=desc&per_page=5`;
    // const myQuery = "q=tetris+language:assembly&sort=stars&order=desc";

    if (inpValue !== '') {


      const response = await fetch(
        `https://api.github.com/search/repositories?${myQuery}`)


      // const response = await fetch(
      //   `https://api.github.com/search/repositories?${myQuery}`
      // );

      const reps = await response.json();
      if (reps.hasOwnProperty('message')) { // костальная обработка 403
        showMessageError('error of search. Try again')
        return reps.message
      }
      if (reps.total_count === 0) {
        showMessageError('nothing found');
      } else {

        // если запрос прошёл успешно -
        // getSearched(reps.items)) - массив из 5 массивов [name, owner,stars]
        console.log('result', showSearched(getSearched(reps.items)))
      }
      // })
      return reps


    }


  }


  function getSearched(reps) {
    return reps.reduce((list, cur) => {
      list.push([cur.name, cur.owner.login, cur.stargazers_count])
      return list
    }, [])
  }

  (function () { // для запуска программы

    const inp = document.querySelector('.search__inp')
// обернули в debounce
    const debounceTime = 500
    const debouncedLoginp = debounce(getReps, debounceTime)


    inp.addEventListener('input', async (e) => {
      //удаляю предыдущий автокомплит
      const searchedList = document.querySelector('.search__list')
      if (searchedList) searchedList.remove()

      // запрос
      const reps = await debouncedLoginp(inp.value)
    })


  })()

}
