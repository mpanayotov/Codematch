var time_options = [
	{axis: "Analysis", value: 5, position:5, order: 0, default: 1},
	{axis: "Science", value: 5, position:5, order: 1, default: 1},
	{axis: "Documentation", value: 5, position:5, order: 2, default: 1},
	{axis: "Code Review", value: 5, position:5, order: 3, default: 1},
	{axis: "Testing", value: 5, position:5, order: 4, default: 1},
	{axis: "UI/UX", value: 5, position:5, order: 5, default: 1},
	{axis: "Front-end", value: 5, position:5, order: 6, default: 1},
	{axis: "Back-end", value: 5, position:5, order: 7, default: 1},
	{axis: "Operations", value: 5, position:5, order: 8, default: 1},
	{axis: "Architecture", value: 5, position:5, order: 9, default: 1}
];

var radar = MovableRadarChart.draw("#chart", time_options, options);