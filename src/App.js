import './App.css';
import { useState, useEffect} from 'react';

const URL = 'http://localhost/shoppinglist/';


function App() {

  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    let status = 0;
    fetch(URL + 'index.php')
    .then(res => {
      status = parseInt(res.status);
      return res.json()
    })
    .then(
      (res) => {
        if (status === 200) {
          setItems(res);
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }, [])

  function add(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'add.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: item,
        amount: amount
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json()
    })
    .then(
      (res) => {
        if (status === 200) {
          setItems(items => [...items,res]);
          //kenttä tyhjenee
          setItem('');
          setAmount('');
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }

  function remove(id) {
    let status = 0;
    fetch(URL + 'delete.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          const updatedList = items.filter((item) => item.id !== id);
          setItems(updatedList);
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }

  return (
    <div className='container'>
      <h2>Shopping list</h2>
      <form onSubmit={add}>
        <div>
          <label>Item: </label>
          <input placeholder="What to buy?" type="text" value={item} onChange={e => setItem(e.target.value)} />
          <label>Amount: </label>
          <input placeholder="How many?" type="number" value={amount} onChange={e => setAmount(e.target.value)}/>
          <button>Add</button>
        </div>
      </form>
      <ol>
        {items.map(item => (
          <li key={item.id}>{item.description} - {item.amount} pc.<a onClick={() => remove(item.id)} href="#">Delete</a></li>
        ))}
      </ol>
    </div>
  );
}

export default App;
