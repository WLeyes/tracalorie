console.log('Connected to app.js');
////////////////////////////////////////////////////////////////////
// Storage Controller                                             //
////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////
// Item Controller                                                //
////////////////////////////////////////////////////////////////////
const ItemCtrl = ( () => {
  // Item Constructor
    const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 400},
      // {id: 2, name: 'Eggs', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public Method
  return {
    getItems: () => data.items,

    addItem: (name, calories) => {
      let ID;
      
      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);
      
      //Create new item
      newItem = new Item(ID, name, calories);
      
      //add to items array
      data.items.push(newItem);
      
      //return new item
      return  newItem;
    },

    getItemByID: (id) => {
      let found = null;
      // Loop through the items
      data.items.forEach( (item) => {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: (name, calories) => {
      // calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach( (item) => {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    setCurrentItem: (item) => data.currentItem = item,

    getCurrentItem: () => data.currentItem,

    getTotalCalories: () => {
      let total = 0;
      
      // Loop through items and add colories
      data.items.forEach( item => total += item.calories);
      
      // Set total calories in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },

    logData: () => {
      return data;
    }

  }
})();


////////////////////////////////////////////////////////////////////
// UI Controller                                                  //
////////////////////////////////////////////////////////////////////
const UICtrl = ( () => {
  // Selectors for the markup
 const UISelectors = {
   itemList: '#item-list',
   listItems: '#item-list li',
   addBtn: '.add-btn',
   updateBtn: '.update-btn',
   deleteBtn: '.delete-btn',
   backBtn: '.back-btn',
   itemNameInput: '#item-name',
   itemCaloriesInput: '#item-calories',
   totalCalories: '.total-calories'
 }

  // Public Method
  return {
    populateItemList: (items) => {
      let html = '';
      items.forEach( (item) => {
        html += 
        `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>
        `;
      });

      // Insert list items in to the DOM
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: (item) => {
      // display list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = 
      `
      <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
      `;
      // insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    updateListItem: (item) => {
      let listItems =  document.querySelectorAll(UISelectors.listItems);

      //Convert NodeList in to an Array
      listItems = Array.from(listItems);

      // Loop through Array
      listItems.forEach( (listItem) => {
        const itemID = listItem.getAttribute('id');
        
        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = 
          `
          <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      });
    },

    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: () => {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: () => UISelectors
  }
})();


////////////////////////////////////////////////////////////////////
// App Controller                                                 //
////////////////////////////////////////////////////////////////////
const App = ( (ItemCtrl, UICtrl) => {

  // Load event listeners
  const loadEventListeners = () => {
    
    // Get UI selectors 
    const UISelectors = UICtrl.getSelectors();
    
    // Add item events
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    
    // Disable submit on enter
    document.addEventListener('keypress', (e) => {
      if(e.keyCode === 13 || e.which === 13) { // enter key
        e.preventDefault();
        return false;
      } 
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    
    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    
    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
  }

  // Add item submit
  const itemAddSubmit = (e) => {

    // Get form input from UI controller
    const input = UICtrl.getItemInput();
    
    // Check for name and calorie input
    if(input.name !== '' && input.calories !== '') {
      
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      
      // Add item to UI list
      UICtrl.addListItem(newItem);
      
      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      
      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear input fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }

  // Click to edit item
  const itemEditClick = (e) => {
    if(e.target.classList.contains('edit-item')) {

      // Get list item ID
      const listID = e.target.parentNode.parentNode.id;
      
      // break into an array
      const listIDArray = listID.split('-')
      
      // Get id
      const id = parseInt(listIDArray[1]);
      
      // Get Item to edit
      const itemToEdit = ItemCtrl.getItemByID(id);
      
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      
      // Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = (e) => {

    // Get item input
    const input = UICtrl.getItemInput();
    
    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    
    // Update UI
    UICtrl.updateListItem(updatedItem);
    
    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);
    
    // Clear the edit state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Public Methods
  return {
    init: () => {

      // Set initial state
      UICtrl.clearEditState();
      
      // Fetch Items from ItemCtrl data structure
      const items = ItemCtrl.getItems();
      
      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with Items
        UICtrl.populateItemList(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();
      
      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);



// Ititialize App
App.init();

