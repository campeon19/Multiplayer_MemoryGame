import './App.css';
import { ContextSocketProvider } from './context/context-socketio';


function App() {
  return (
    <ContextSocketProvider>
      <div className="App">
        <header className="App-header">

          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </ContextSocketProvider >
  );
}

export default App;