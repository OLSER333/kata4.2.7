export default function createEl(tag, opts) {
  const addingEl = document.createElement(tag)
  // перебираем ключи объекта и записывает соответствующие свойства в элемент
  for (const key in opts) {
    addingEl[key] = opts[key]
  }
  // возвращаем готовый элемент
  return addingEl
}
