/* 🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧
 🟧🟧🟧🟧Kontroler Budżetu🟧🟧🟧🟧
🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧*/

var budgetController = (function () {
	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function (type) {
		var sum = 0;
		data.allItems[type].forEach(function (cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp: [],
			inc: [],
		},
		totals: {
			exp: 0,
			inc: 0,
		},
		budget: 0,
		percetnage: -1,
	};
	return {
		addItem: function (type, des, val) {
			var newItem, ID;

			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			//stwórz Item bazujący na Exp lub Inc
			if (type === "exp") {
				newItem = new Expense(ID, des, val);
			} else if (type === "inc") {
				newItem = new Income(ID, des, val);
			}
 
			//Push do struktury danych
			data.allItems[type].push(newItem);
			return newItem;
		},

		test: function () {
			console.log(data);
		},

		calculateBudget: function () {
			//Obliczanie sumy Income i sumy Expense
			calculateTotal("exp");
			calculateTotal("inc");

			//Obliczanie budzetu razem (income - expense)
			data.budget = data.totals.inc - data.totals.exp;

			//Oblicznie procentu wydanego income
			if (data.totals.inc > 0) {
				data.percetnage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}
		},

		getBudget: function () {
			return {
				BudgetLeft: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percetnageSpent: data.percetnage,
			};
		},
	};
})();

/*🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦
 🟦🟦🟦🟦🟦Kontroler UI🟦🟦🟦🟦🟦
🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦*/

var UIController = (function () {
	var DOMstrings = {
		inputType: ".add__type",
		inputValue: ".add__value",
		inputDescription: ".add__description",
		inputBtn: ".add__btn",
		incomeContainer: ".income__list",
		expensesContainer: ".expenses__list",
		budgetLabel: ".budget__value",
		incomeLabel: ".budget__income--value",
		expensesLabel: ".budget__expenses--value",
		percentageLabel: ".budget__expenses--percentage",
		container: ".container"
	};

	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
				description: document.querySelector(DOMstrings.inputDescription).value,
			};
		},

		addListItem: function (obj, type) {
			var html, newHtml, element;

			//TWORZENIE ELEMENTU HTML Z TEKSTEM DO ZAMIANY

			if (type === "inc") {
				element = DOMstrings.incomeContainer;
				html =
					'<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if ((type = "exp")) {
				element = DOMstrings.expensesContainer;
				html =
					'<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//ZAMIANA ZMIENNYCH ELEMENTÓW WŁAŚCIWYMI DANYMI

			newHtml = html.replace("%id%", obj.id);
			newHtml = newHtml.replace("%description%", obj.description);
			newHtml = newHtml.replace("%value%", obj.value);

			//WKLEJANIE STWORZONEGO ELEMENTU HTML Z DANYMI DO DOM

			document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
		},
		
		//CZYSZCZENIE INPUT FIELDS

		clearFields: function () {
			var fields;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

			var fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function (current, index, array) {
				current.value = "";
			});
			fieldsArr[0].focus();
		},

		displayBudget: function(obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.BudgetLeft;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

			if(obj.percetnageSpent > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percetnageSpent + "%";
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';		
			}
		},

		//DOMstrings dostępny globalnie

		getDOMstrings: function () {
			return DOMstrings;
		},

	};
})();

/* 🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩
  🟩🟩🟩🟩🟩GLOBAL🟩🟩🟩🟩🟩🟩
 🟩🟩🟩🟩UI + Budget🟩🟩🟩🟩
🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩*/

var controller = (function (budgetCtrl, UICtrl) {

	//SPRAWDZA ENTER LUB KLIK || jeśli true = dodaje item do listy
	var setUpEventListeners = function () {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

		document.addEventListener("keypress", function (event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
		
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};

	var updateBudget = function () {
		// 1. Oblicz budżet
		budgetCtrl.calculateBudget();
		// 2. Return budżet
		var budget = budgetCtrl.getBudget();
		// 3. Wyświetl budżet w UI
		UIController.displayBudget(budget);
	};

	var ctrlAddItem = function () {
		var input, newItem;
		// 1. Get the field input data
		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			//  2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//  3.a Add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			// 3.b Clear the fields
			UICtrl.clearFields();

			//  4. Calculate the budget
			updateBudget();
		}
	};

	var ctrlDeleteItem = function(event) {
		console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
		
	}

	return {
		init: function () {
			console.log("app has started");
			UIController.displayBudget({
				BudgetLeft: 0,
				totalInc: 0,
				totalExp: 0,
				percetnageSpent: -1,
			});

			setUpEventListeners();
		},
	};
})(budgetController, UIController);

controller.init();