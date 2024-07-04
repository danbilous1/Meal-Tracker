const dishes = handleLocalStorage('dishes_saved') || []
let tbodyIn = document.querySelector('tbody');

for (let i = 0; i < dishes.length; i++) {
  let {title, calories, carbs, fat, protein, cuisines} = dishes[i];
	createRow(tbodyIn, title, calories, carbs, fat, protein, cuisines)//spred operator
}


function renderStep(instruction, i, stepsDiv) {
	const step = document.createElement('p');
	step.innerText = "Step " + (i + 1) + " - " + instruction.step;
	stepsDiv.appendChild(step);

	const ingridientUL = document.createElement('ul');
	ingridientUL.classList.add('ingridient-ul');
	instruction.ingredients.forEach(ingridient => {

		const ingridientLI = document.createElement('li');

		ingridientLI.innerText = ingridient.name;
		ingridientUL.appendChild(ingridientLI);
	})

	stepsDiv.appendChild(ingridientUL);
}

function renderTableRow(caloricBreakdown, calories, title, cuisines, container) {
	// percentCarbs: 45.96
	// percentFat: 34.59
	// percentProtein: 19.45

	// amount: 910.27
	// name: "Calories"
	// percentOfDailyNeeds: 45.51
	// unit: "kcal"
	const carbs = caloricBreakdown['percentCarbs'];
	const fat = caloricBreakdown['percentFat'];
	const protein = caloricBreakdown['percentProtein'];

	let dish = createRow(container, title, calories.amount, carbs, fat, protein, cuisines.join(', '))
	dishes.push(dish)
	handleLocalStorage('dishes_saved', dishes)
}


function createRow(container, title, calories, carbs, fat, protein, cuisines) {
	
	let id = 0;
	id = container.childNodes.length
	// console.log(container);
	const trTable = document.createElement('tr');
	trTable.innerHTML = `
		<td>${id}</td>
			<td>${title}</td>
			<td>${calories}</td>
			<td>${carbs} g</td>
			<td>${fat}</td>
			<td>${protein} g</td>
			<td>${cuisines}</td>
	`;
	container.append(trTable);
	const dish = {
		id,
		title,
		calories,
		carbs,
		fat,
		protein,
		cuisines,
	}
	return dish
};


function handleLocalStorage(key, value) {
	if (key && value) {
		localStorage.setItem(key, JSON.stringify(value))
	}else if (key) {
		let result = localStorage.getItem(key);
		if (result) {
			return JSON.parse(result);
		} else {
			return result;
		}
	}

}

async function searchHandler(payload) {
	const { searchInputValue, apiKey, dishCache, ingridientsCache, stepsDiv } = payload;
	const url = `https://api.spoonacular.com/recipes/complexSearch?query=${searchInputValue}&number=5&apiKey=${apiKey}`;
	let result = await memorizeRequest('dishes', url, dishCache)
	// console.log(result);
	const listGroup = document.createElement('ul');
	listGroup.classList.add('list-group');
	dishContainer.insertAdjacentElement('afterend', listGroup);
	result.results.forEach(dish => {
		const listItem = document.createElement('li');
		listItem.classList.add("list-group-item");
		listItem.innerText = dish.title;
		listGroup.appendChild(listItem);

		listItem.addEventListener('click', async function() {
			// stepsDiv.innerHTML = '';
			// const recipeName = document.createElement('h2');
			// recipeName.innerText = dish.title;
			// stepsDiv.appendChild(recipeName);
			const modal = document.querySelector('.btn-secondary');
			modal.click();
			const urlIngridient = `https://api.spoonacular.com/recipes/${dish.id}/information?apiKey=${apiKey}&includeNutrition=true&addTasteData=false&addWinePairing=false`;
			let resultIngridient = await memorizeRequest('ingridients', urlIngridient, ingridientsCache);
			console.log(resultIngridient);
			let tbody = document.querySelector('#collapseOne tbody');
			// console.log(tbody);
			renderTableRow(resultIngridient.nutrition['caloricBreakdown'], resultIngridient.nutrition.nutrients[0], resultIngridient.title, resultIngridient.cuisines, tbody);
			
			// resultIngridient.analyzedInstructions[0].steps.forEach((el, index) => renderStep(el, index, stepsDiv))
			//renderRow
		})

		listItem.addEventListener('mouseenter', function() {
			// const modalContent = document.querySelector('.modal')
			this.style.backgroundImage = `url(${dish.image})`
			this.style.backgroundSize = `contain`
			this.style.backgroundRepeat = `no-repeat`
			this.style.backgroundPositionX = `right`

		})
		listItem.addEventListener('mouseleave', function() {
			this.style.backgroundImage = ``;
		})
	})
}

function memorizeRequest(key, url, cache,) {
	return new Promise((resolve, reject) => {
		if (url in cache) {
			resolve(cache[url]);
		} else {
			fetch(url)
				.then(respond => respond.json())
				.then(data => {
					cache[url] = data;
					localStorage.setItem(key, JSON.stringify(cache))
					resolve(cache[url]);
				})
				.catch(error => {
					reject(error);
				});
		}
	});
}
