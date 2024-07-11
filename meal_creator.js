let meal = {
	// time:
	dishes: [
		// {
		//  dish_id,
		//  amount
		// }
	],
	// summary:{
	// 	calories, 
	// 	carbs, 
	// 	fat, 
	// 	protein
	// }
}
let meals = handleLocalStorage('meals_saved') || [];

const addDish = document.querySelector('#addDish');
const saveDish = document.querySelector('#saveDish');
let grammsInput = document.createElement('input');

const dishContainer2 = document.querySelector('.calculate-container');
let answer = document.createElement('p');
answer.className = 'answer mt-3';
answer.innerText = "";

dishContainer2.insertAdjacentElement('beforebegin', answer);

saveDish.addEventListener('click', function() {
	if (grammsInput.value > 0) {
		
		
		meal.time = new Date();
		meals.push(meal);
		updateChart(meal)
		createReportRow(meal);
		meal = { dishes: [] }
		answer.innerText = "";
		dishContainer2.innerHTML = ""
		handleLocalStorage('meals_saved', meals)
		// console.log(meal)
	}
})


addDish.addEventListener('click', function() {
	// console.log(meals)
	let dishPayload = {
		dish_id: null,
		amount: 0

	}

	meal.dishes.push(dishPayload);

	let container = document.createElement('div')
	container.className = 'input-group mt-3';

	let dishInput = document.createElement('input');
	dishInput.className = 'form-control';
	dishInput.placeholder = 'Dish title';

	const listGroup = document.createElement('ul');
	listGroup.classList.add('list-group');

	dishInput.addEventListener('input', function(event) {
		listGroup.innerHTML = '';
		let title = event.target.value;
		findDishMatch.call(this, title, listGroup, (id) => { dishPayload.dish_id = id });
	})


	grammsInput.className = 'form-control gramms';
	grammsInput.placeholder = 'Gramms';
	grammsInput.addEventListener('input', function(event) {
		dishPayload.amount = event.target.value;
		meal.summary = calculateSummary(meal.dishes)
	})

	container.append(dishInput, grammsInput);
	dishContainer2.append(container, listGroup);
})


function calculateSummary(list) {
	//how to visualise (just a line with four values)
	console.log(list)

	let formulaCalories = 0;
	let formulaCarbs = 0;
	let formulaFat = 0;
	let formulaProtein = 0;
	let formulaSummary = 0;

	list.forEach(dish => {
		let id = dish.dish_id;
		let amount = dish.amount / 100
		let dishData = dishes.find(dish => dish.id == id)
		formulaCalories += amount * dishData.calories;
		formulaCarbs += amount * dishData.carbs;
		formulaFat += amount * dishData.fat;
		formulaProtein += amount * dishData.protein;
		formulaSummary += Number(dish.amount);
		//for every nutrion item multiply per amount coeficient
		// formula = (gramms / 100) * info
	})
	answer.innerText = `Calories: ${Math.round(formulaCalories)}, Carbs: ${Math.round(formulaCarbs)}, Fat: ${Math.round(formulaFat)}, Protein: ${Math.round(formulaProtein)}`;
	return {
		calories: formulaCalories,
		carbs: formulaCarbs,
		fat: formulaFat,
		protein: formulaProtein,
		summary: formulaSummary,
	}
}

function findDishMatch(title, listGroup, cb) {
	let filtered = dishes.filter(dish => {
		return dish.title.toLowerCase().includes(title.toLowerCase());//борщ == борщ
	})
	filtered.forEach(dish => {
		const listItem = document.createElement('li');
		listItem.classList.add("list-group-item");
		listItem.innerText = dish.title;
		listGroup.append(listItem);
		listItem.addEventListener('click', () => {
			listGroup.innerHTML = "";
			this.value = dish.title;
			cb(dish.id);
		})
	})
}
