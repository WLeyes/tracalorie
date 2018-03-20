console.log('Connected to app.js');
////////////////////////////////////////////////////////////////////
// Storage Controller                                             //
////////////////////////////////////////////////////////////////////
const StorageCtrl = ( newItem => {
  // Public Method
  return {
    storeItem:  item => {

      let items;
      // Check if any items exist
      if(localStorage.getItem('items') === null) {
        items = [];
        
        // Push new item
        items.push(item);
        
        // Set localStorage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Retrieve localStorage content
        items = JSON.parse(localStorage.getItem('items'));
        
        // Push new item into array
        items.push(item);
        
        // Reset localStorage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromStorage: () => {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: updatedItem => {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach( (item, index) => {
        if(updatedItem.id === item.id) {
          items.splice(index,1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemFromStorage: id => {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach( (item, index) => {
        if(id === item.id) {
          items.splice(index,1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearItemsFromStorage: () =>{
      localStorage.removeItem('items');
    }

  }
})();

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
    items: StorageCtrl.getItemsFromStorage(),
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

    getItemByID: id => {
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

    deleteItem: id => {
      // Get id's 
      const ids = data.items.map( item => item.id);
      // Get index
      const index = ids.indexOf(id);
      // Remove item
      data.items.splice(index,1);
    },

    clearAllItems: items => {
      data.items = [];
    },

    setCurrentItem: item => data.currentItem = item,

    getCurrentItem: () => data.currentItem,

    getTotalCalories: () => {
      let total = 0;
      
      // Loop through items and add colories
      data.items.forEach(item => total += item.calories);
      
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
   clearBtn: '.clear-btn',
   itemNameInput: '#item-name',
   itemCaloriesInput: '#item-calories',
   totalCalories: '.total-calories'
 }

  // Public Method
  return {
    populateItemList: items => {
      let html = '';
      items.forEach(item => {
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

    addListItem: item => {
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

    updateListItem: item => {
      let listItems =  document.querySelectorAll(UISelectors.listItems);

      //Convert NodeList in to an Array
      listItems = Array.from(listItems);

      // Loop through Array
      listItems.forEach(listItem => {
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

    deleteListItem: id => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
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

    removeItems: () => {
      let listItems = document.querySelector(UISelectors.listItems);
      // Convert nodeList in to Array
      listItems = Array.from(listItems);
      listItems.forEach(item => item.remove());
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
const App = ( (ItemCtrl, StorageCtrl, UICtrl) => {

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

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear all items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    
    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
  }

  // Add item submit
  const itemAddSubmit = e => {

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

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear input fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }

  // Click to edit item
  const itemEditClick = e => {
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
  const itemUpdateSubmit = e => {

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

    // Update localStorage
    StorageCtrl.updateItemStorage(updatedItem);
    
    // Clear the edit state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Delete button submit
  const itemDeleteSubmit = e => {

    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();
    
    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);
    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from localStorage
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    
    // Clear the edit state
    UICtrl.clearEditState();

    e.preventDefault();
  }
  

  // Clear all items button event
  const clearAllItemsClick = e => {
    
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    
    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear from localStorage
    StorageCtrl.clearItemsFromStorage();

    // Hide UL
    UICtrl.hideList();

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
})(ItemCtrl, StorageCtrl, UICtrl);



// Ititialize App
App.init();

