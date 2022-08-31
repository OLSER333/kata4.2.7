export default function getAddEl(arr, addingEl) {
  if (arr.length === 0) return null
  for (let innerArrEl of arr) {
    // если innerArrEl имя === clicked имя
    if (innerArrEl[0] === addingEl) return innerArrEl
  }
  return null
}
