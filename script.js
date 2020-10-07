console.log('script is working')

const valArr = document.querySelector('.container')
let gridVal = (valArr.textContent).replace(/\W+/g, '')

console.log(gridVal)