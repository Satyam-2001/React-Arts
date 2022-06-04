# 🎨 React Arts

`React Arts` is a library of react functional component which provides `canvas sketch board` in the app.

This library contains two react component `CanvasSketch` and `CanvasSketchTool`

<p align="center">
<img width="641" alt="react_arts" src="https://user-images.githubusercontent.com/88069082/172010401-36293ebb-f376-4ac5-be17-39996828542e.PNG">
</p>


# Installation

This module is installed via npm:

```shell
npm install react-arts
```

# CanvasSketch 

`CanvasSketch component` appends simple canvas where a user can sketch using mouse or touch behaviour on screen.

```javascript
import './App.css';
import { CanvasSketch } from 'react-arts';

function App() {

  const [clearCanvas, setClearCanvas] = useState()

  return (
    <div className="App">
      <CanvasSketch 
        height={450} 
        width={750}
        getClearCanvas = {setClearCanvas}
    />
    <button onClick={clearCanvas}>Clear Frame</button>
    </div>
  );
}

export default App;
```

## API

| Name           | Type           | Required | Default | Description                                 |
| -------------- | -------------- | -------- | ------- | ------------------------------------------- |
| height         | Number         | true     | -       | Height of canvas
| width          | Number         | true     | -       | Width of canvas
| color          | String         | false    | black   | Color for sketch
| lineWidth      | Number         | false    | 4       | Width of the pen 
| lineCap        | String         | false    | round   | Shape of pen for sketch
| option         | String         | false    | pen     | Option for sketch [pen / paint]
| getClearCanvas | Function       | false    | -       | Returs clearCanvas function to setState

<br />

# CanvasSketchTool

`CanvasSketchTool component` is advance version of CanvasSketch which also comes with a tool kit to change and use properties like `color`, `erase`, `line width`, `clear canvas`, `floodfill`.

```javascript
import './App.css';
import { CanvasSketchTool } from 'react-arts';

function App() {

  return (
    <div className="App">
      <CanvasSketchTool
        height={450} 
        width={750} 
    />
    </div>
  );
}

export default App;
```

## API

| Name           | Type           | Required | Default | Description                                 |
| -------------- | -------------- | -------- | ------- | ----------------- |
| height         | Number         | true     | -       | Height of canvas
| width          | Number         | true     | -       | Width of canvas

<br />

# Author

<a href="https://github.com/Satyam-2001"> Satyam Lohiya </a>