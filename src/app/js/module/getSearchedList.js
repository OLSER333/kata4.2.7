import createEl from "./createEl";

export default function getSearchedList(arr) {
  const searchedList = createEl('ul', {className: 'search__list'})
  for (const addingEl of arr) {
    const listItem = createEl('li', {className: 'search__list-item', textContent: addingEl[0]})
    searchedList.appendChild(listItem)
  }
  document.querySelector('.search').appendChild(searchedList)
  return searchedList
}
