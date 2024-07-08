let apiKey = '9d5282fedb7a427cb2616d5bedee69f4'

let columns = [

];


let dishCache = JSON.parse(localStorage.getItem('dishes')) || {}
let ingridientsCache = JSON.parse(localStorage.getItem('ingridients')) || {}



const newBtn = document.querySelector('#newDish');
const findBtn = document.querySelector('#findDish');
const dishContainer = document.querySelector('#dishInputsContainer');

findBtn.addEventListener('click', function() {
  dishContainer.innerHTML = `
		<div class="input-group mt-3">
  <input type="text" class="form-control" placeholder="Recipe title" aria-label="Recipient's username" aria-describedby="basic-addon2">
  <span class="input-group-text" id="basic-addon2">Search</span>
</div>
	`
  const searchBtn = dishContainer.querySelector('#basic-addon2');
  const searchInput = dishContainer.querySelector('input');
  const stepsDiv = document.querySelector('.recipe-steps');



  searchBtn.addEventListener('click', () => searchHandler({ searchInputValue: searchInput.value, apiKey, dishCache, ingridientsCache, stepsDiv }))


  //GET https://api.spoonacular.com/recipes/complexSearch?query=_______&number=5

  // <ul class="list-group">
  // 	<li class="list-group-item">An item</li>
  // 	<li class="list-group-item">A second item</li>
  // 	<li class="list-group-item">A third item</li>
  // 	<li class="list-group-item">A fourth item</li>
  // 	<li class="list-group-item">And a fifth one</li>
  // </ul>
})

const closeBtn = document.querySelector('#btn-close');
closeBtn.addEventListener('click', function() {
  dishContainer.innerHTML = '';
  let listGroup = document.querySelector('.list-group')
  if (listGroup) {
    listGroup.remove()
  }
})

newBtn.addEventListener('click', function() {
  dishContainer.innerHTML = `
    <div class="input-group mt-3">
  <input type="text" class="form-control" placeholder="Dish name" aria-label="Recipient's username" aria-describedby="basic-addon2" id="dish-name">
  </div>
    <div class="input-group mt-3">
  <input type="number" class="form-control" placeholder="Calories" aria-label="Recipient's username" aria-describedby="basic-addon2" id="calories">
  </div>
    <div class="input-group mt-3">
  <input type="number" class="form-control" placeholder="Carbs" aria-label="Recipient's username" aria-describedby="basic-addon2" id="carbs">
  </div>
    <div class="input-group mt-3">
  <input type="number" class="form-control" placeholder="Fat" aria-label="Recipient's username" aria-describedby="basic-addon2" id="fat">
  </div>
    <div class="input-group mt-3">
  <input type="number" class="form-control" placeholder="Protein" aria-label="Recipient's username" aria-describedby="basic-addon2" id="protein">
  </div>
    <div class="input-group mt-3">
  <input type="text" class="form-control" placeholder="Cuisines" aria-label="Recipient's username" aria-describedby="basic-addon2" id="cuisines">
  </div>
  <button type="button" class="btn btn-primary mt-3" id="create-button">Create</button>
  `

  const createBtn = dishContainer.querySelector('#create-button');
  createBtn.addEventListener('click', function() {
    const dishName = dishContainer.querySelector('#dish-name').value;
    const caloriesIn = dishContainer.querySelector('#calories').value;
    const carbsIn = dishContainer.querySelector('#carbs').value;
    const fatIn = dishContainer.querySelector('#fat').value;
    const proteinIn = dishContainer.querySelector('#protein').value;
    const cuisinesIn = dishContainer.querySelector('#cuisines').value;

    let tbodyIn = document.querySelector('#collapseOne tbody');

    let dish = createRow(tbodyIn, dishName, caloriesIn, carbsIn, fatIn, proteinIn, cuisinesIn);
    dishes.push(dish)
    handleLocalStorage('dishes_saved', dishes)
    const modal = document.querySelector('.btn-secondary');
    modal.click();
  })
})


