import './App.css';
import CanvasSketchTool from './src/CanvasSketchTool/CanvasSketchTool';

function App() {
  return (
    <div className="App">
      <h1>REACT ARTS</h1>
      <CanvasSketchTool height={450} width={750} />
      <p className='footer'>Developed By <a target='_blank' href='https://github.com/Satyam-2001'>Satyam Lohiya</a></p>
    </div>
  );
}

export default App;