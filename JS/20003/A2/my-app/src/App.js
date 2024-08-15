import logo from './logo.svg';
import './App.css';
import DataComponent from './components/DataComponent';
import FavoritesComponent from './components/FavoritesComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
    <DataComponent/>
    <FavoritesComponent/>
      </header>
    </div>
  );
}

export default App;
