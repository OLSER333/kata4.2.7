import debounce from "./debounce";
import showMessageError from "./showMessageError";
import createEl from "./createEl";
import getAddEl from "./getAddEl";
import getSelectedNode from "./getSelectedNode";
import cleanInp from "./cleanInp";
import getSearchedList from "./getSearchedList";
import setSelectedListEventListener from "./setSelectedListEventListener";
import getSearched from "./getSearched";


export default function myFFF() {


  function showSearched(arr) {
    // arr - массив из [name, owner, stars] * 5
    const searchedList = getSearchedList(arr)
    //вешаю кликер для переноса элементов в selectedList
    searchedList.addEventListener('click', (e) => {
      const addingEl = getAddEl(arr, e.target.innerText)
      if (addingEl === null) return // если промахнулись

      let selectedList = document.querySelector('.selected__list')
      if (selectedList === null) { // не существ listNode
        selectedList = createEl('ul', {className: 'selected__list'})
        document.querySelector('.search').after(selectedList)
        setSelectedListEventListener() // вешаем обработчик для удаления li и пустого ul selected
      }

      const emptyReadyItem = getSelectedNode()
      const forSelectedItem = emptyReadyItem.firstElementChild

      forSelectedItem.appendChild(createEl('p', {textContent: `Name: ${addingEl[0]}`}))
      forSelectedItem.appendChild(createEl('p', {textContent: `Owner: ${addingEl[1]}`}))
      forSelectedItem.appendChild(createEl('p', {textContent: `Stars: ${addingEl[2]}`}))

      // добавляем в дом
      selectedList.appendChild(emptyReadyItem)

      searchedList.remove()
      cleanInp()
    })
  }


  async function getReps(inpValue) {
    const myQuery = `q=${inpValue}&sort=stars&order=desc&per_page=5`;
    if (inpValue !== '') { // не отправляет пустой запрос
      const response = await fetch(
        `https://api.github.com/search/repositories?${myQuery}`)
      const reps = await response.json();

      if (reps.hasOwnProperty('message')) { // костыльная обработка 403
        showMessageError('error of search. Try again later, please')
        return reps.message
      }

      if (reps.total_count === 0) { // если не нашёл ни одного репа
        showMessageError('nothing found');
      } else {
        // если запрос прошёл успешно -
        // getSearched(reps.items)) - массив из 5 массивов [name, owner,stars]
        showSearched(getSearched(reps.items))
      }
      return reps
    }
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
      await debouncedLoginp(inp.value)
    })
  })()

}
