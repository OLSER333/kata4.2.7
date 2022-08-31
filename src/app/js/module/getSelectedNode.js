import createEl from "./createEl";

export default function getSelectedNode() {
  const selectedItem = createEl('li', {className: 'selected__item'})
  const selectedTxt = createEl('div', {className: 'selected__txt'})
  const selectedBtn = createEl('button', {className: 'selected__del-btn'})
  selectedItem.appendChild(selectedTxt)
  selectedItem.appendChild(selectedBtn)
  return selectedItem
}
