import { useState , useEffect} from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: uuidv4(),
    label: "Have fun",
  },
  {
    key: uuidv4(),
    label: "Spread Empathy",
  },
  {
    key: uuidv4(),
    label: "Generate Value",
  },
];

// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(() => toDoItems);

  const [filterType, setFilterType] = useState("all");

  const [filteredItem, setFilterItem] = useState([]);
  
  const [searchedItem,setSearchedItem] = useState("");

  const [toggleItems,setToggleItems] = useState(false);

  useEffect(()=>{
    const  itemsTemp = JSON.parse(localStorage.getItem("item"))?JSON.parse(localStorage.getItem("item")):[]
    setItems([...itemsTemp])
  },[])
  
  useEffect(() => {
  
    if(toggleItems){
      localStorage.setItem("item", JSON.stringify(items))
      setToggleItems(false);
    }
  
  },[items,toggleItems])

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    // not mutating !CORRECT!
    setItems((prevItems) => [
      { label: itemToAdd, key: uuidv4() },
      ...prevItems,
    ]);

    setItemToAdd("");
    setToggleItems(true);
  };

  const handleItemDone = ({ key }) => {
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, done: !oldItem.done };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    //  second way
    // const changedItem = items.map((item) => {
    //   if (item.key === key) {
    //     return { ...item, done: item.done ? false : true };
    //   } else return item;
    // });

    //second way updated
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleItemImportant = ({ key }) => {
    setItems((prevItems) =>
    prevItems.map((item) => {
      if (item.key === key) {
        return { ...item, important: !item.important };
      } else return item;
    })
  );
};

  const handleSearchItem = (e) => {
    setSearchedItem(e.target.value);

  // let value = e.target.value.toLowerCase();
  // const filteredItem1 = items.filter((item)=>
  //     item.label.toLowerCase().includes(value)
  // );
  // setFilterType("search")
  // setFilterItem([...filteredItem1]);
  // console.log(filteredItem)
}; 

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const handleRemoveItem = ({ key })=> {
    const removeArr = ([...items].filter(item => item.key !== key))
    setItems(removeArr);
  }

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const searchedItems = items.filter((item)=>item.label.includes(searchedItem));


  const filteredItems =
    !filterType || filterType === "all"
      ? searchedItems
      : filterType === "active"
      ? searchedItems.filter((item) => !item.done)
      : searchedItems.filter((item) => item.done)


  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          value={searchedItem}
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleSearchItem}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}${item.important ? " important" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={()=> handleItemImportant(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={()=> handleRemoveItem(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
