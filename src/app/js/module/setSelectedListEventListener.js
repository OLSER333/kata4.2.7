export default function setSelectedListEventListener() {
  document.querySelector('.selected__list').addEventListener('click', (listElem) => {
    let deletingEl = listElem.target.closest('.selected__del-btn') // клик по кресту
    if (deletingEl) {
      deletingEl.parentElement.remove()

      //опустел лист - удалили из дерева
      if (document.querySelector('.selected__item') === null) {
        document.querySelector('.selected__list').remove()
      }
    }
  })
}
