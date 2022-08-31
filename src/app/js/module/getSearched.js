export default function getSearched(reps) {
  return reps.reduce((list, cur) => {
    list.push([cur.name, cur.owner.login, cur.stargazers_count])
    return list
  }, [])
}
