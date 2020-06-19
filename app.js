var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type) {
        var sum = 0;
        data.items[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    
    return {
        addItem: function(type, desc, val) {
           var newItem, idt;

        // create a new id
        if (data.items[type] > 0 ) {
            idt = data.items[type][data.items[type].length-1].id + 1;
        } else {
            idt = 0;
        }

        // create a newItem based on type
           if (type === 'exp') {
                newItem = new Expense(idt, desc, val);
           } else if (type === 'inc') {
                newItem = new Income(idt, desc, val);
           }
           
        // Add to our data type structure
           data.items[type].push(newItem);
        // return the one new element
           return newItem;
        },

        calculateBudget: function() {

            // Calculate total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate d percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentage: function () {
            
        },

        deleteItem: function(type, id) {
            ids = data.items[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.items[type].splice(index, 1);
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);            
        }
    }


})();

var UIController = (function() {

    var DOMString = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            addButton: '.add__btn',
            incomeContainer: '.income__list',
            expenseContainer: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expensesLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage',
            container: '.container'

        }        
    

    return {
        getType: function() {
            return {
                type: document.querySelector(DOMString.inputType).value, //It will either inc or exp;
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseFloat(document.querySelector(DOMString.inputValue).value)
            }
        }, 

        addListItem: function (obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder test
            if (type === 'inc') {
                element = DOMString.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMString.expenseContainer;
                html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder test with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Replace the placeholder test with some actual data
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },

        deleteListItem:function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMString.inputDescription + ', '+ DOMString.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMString.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMString.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMString.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0) {
                document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMString.percentageLabel).textContent = '---';

            }
        },

        getDOMString: function () {
            return DOMString;
        }
    }

})();


var controller = (function(budgetCtrl, UICtrl) {

    var eventListerners = function() {
        var DOM = UICtrl.getDOMString();
        document.querySelector(DOM.addButton).addEventListener('click', crtlAddItem);
        document.addEventListener('keypress', function(event) {
             if(event.keyCode === 13 || event.which === 13) {            
                 crtlAddItem();            
             }             
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };

    var updateBudget = function () {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        
    }

    var updatePercentage = function(){
        // 1. CAlculate percentage
        // 2. Read from d buget controller3. 
        // 3. Update the UI with thenew Percens
    }
   
    function crtlAddItem() {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getType();
        if (input.description !== "" && !isNaN(input.value) && input.value) {
         
            // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            // 4. clear the field
            UICtrl.clearFields();
            // 5. calculate the budget and percents
            updateBudget();
            updatePercentage()
            // 6. display the budget on the UI  
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemID, type, splitID, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        // 1. Deletethe item from the data structure
            budgetCtrl.deleteItem(type, ID)
        // 2. Deletethe item from UI
            UICtrl.deleteListItem(itemID);
        // 3. Update and show the new budget and oercents
            updateBudget();
            updatePercentage();
        }

    }

    return {
        init: function() {
            console.log('The game begin'); 
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });           
            eventListerners();
        }
    }


    
})(budgetController, UIController);

controller.init();