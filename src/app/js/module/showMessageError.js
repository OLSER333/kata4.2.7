
import createEl from "./createEl";

export default function showMessageError(message) {
  const errBlock = createEl('div', {className: 'error', textContent: `${message}`})
  const searchInp = document.querySelector('.search__form')
  searchInp.after(errBlock)

  setTimeout(() => {
    errBlock.remove()
  }, 2500)
}
