import './style/App.css';
import StaticLeft from './components/StaticLeft';
import DynamicRight from './components/DynamicRight';

function App() {
  return (
    <div className="App">
      <StaticLeft/>
      <DynamicRight/>
    </div>
  );
}

export default App;
