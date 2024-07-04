function createReportRow(meal) {
	const reports = document.querySelector('.reports');
	let id2 = reports.childNodes.length;
	const trTable2 = document.createElement('tr');
	// console.log(meal);
	const time = meal.time;
	const date = new Date(time);
	const localTime = date.toLocaleString();
	trTable2.innerHTML = `
				<td>${id2}</td>
					<td>${localTime}</td>
					<td>${Math.round(meal.summary.calories)}</td>
					<td>${Math.round(meal.summary.carbs)} g</td>
					<td>${Math.round(meal.summary.fat)}</td>
					<td>${Math.round(meal.summary.protein)} g</td>
					<td>${meal.summary.summary}</td>
			`
	reports.append(trTable2)
}

meals.forEach(meal => {
	createReportRow(meal);
});

//https://www.chartjs.org/docs/latest/samples/bar/border-radius.html
// (async function() {

let chart = new Chart(
	document.getElementById('chart'),
	{
		type: 'bar',
		data: {
			labels: meals.reduce((acc, meal) => {
				const time = meal.time;
				const date = new Date(time);
				const localTime = date.toLocaleDateString();
				if (!acc.includes(localTime)) {
					acc.push(localTime)
				}
					return acc
			}, []),
			datasets: [
				{
					label: 'Portions',
					data: group('summary')
				}, {
					label: 'Calories',
					data: group('calories')
				}, {
					label: 'Carbs',
					data: group('carbs')
				}, {
					label: 'Fat',
					data: group('fat')
				}, {
					label: 'Protein',
					data: group('protein')
				}
			]
		}
	}
);

function group(key){
	let result = meals.reduce((acc,meal) => {
		const time = meal.time;
		const date = new Date(time);
		const localTime = date.toLocaleDateString();
		if(localTime in acc){
			acc[localTime] += meal.summary[key]
		}else{
			acc[localTime] = meal.summary[key]
		}
		return acc
	},{})
	return Object.values(result)
}

function updateChart(meal) {
	const time = meal.time;
	const date = new Date(time);
	const localTime = date.toLocaleTimeString();
	chart.data.labels.push(localTime)
	// console.log(chart.data.datasets)
	chart.data.datasets[0].data.push(meal.summary.summary)
	chart.data.datasets[1].data.push(meal.summary.calories)
	chart.data.datasets[2].data.push(meal.summary.carbs)
	chart.data.datasets[3].data.push(meal.summary.fat)
	chart.data.datasets[4].data.push(meal.summary.protein)
	chart.update()
}
