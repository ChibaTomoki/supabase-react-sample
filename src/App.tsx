import { Link } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>Top Page</h1>
      <ul>
        <li>
          <Link to="page1">Page1</Link>
        </li>
        <li>
          <Link to="page2">Page2</Link>
        </li>
        <li>
          <Link to="page3">Page3</Link>
        </li>
        <li>
          <Link to="page4">Page4</Link>
        </li>
        <li>
          <Link to="todo">Todo</Link>
        </li>
      </ul>
    </div>
  );
}

export default App;
