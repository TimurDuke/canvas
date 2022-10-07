import React from 'react';

const CanvasComponent = (props) => {
    return (
        <>
            <div>
                <canvas
                    ref={props.canvas}
                    style={{border: '1px solid black'}}
                    width={800}
                    height={600}
                    onMouseDown={props.mouseDownHandler}
                    onMouseUp={props.mouseUpHandler}
                    onMouseMove={props.canvasMouseMoveHandler}
                />
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div>
                    <label htmlFor="color">
                        Color
                        <input
                            type="color"
                            style={{margin: '10px', fontSize: '19px'}}
                            name="color"
                            value={props.options.color}
                            onChange={props.inputChangeHandler}
                        />
                    </label>
                    <label htmlFor="size">
                        Size
                        <input
                            type="number"
                            onError={() => console.log('error')}
                            min={1}
                            max={30}
                            style={{margin: '10px', padding: '10px', fontSize: '19px'}}
                            placeholder="Size"
                            name="size"
                            value={props.options.size}
                            onChange={props.inputChangeHandler}
                        />
                    </label>
                </div>
                <div>
                    <p>Choose type</p>
                    <button
                        style={{padding: '10px 15px', background: 'transparent', cursor: 'pointer', marginRight: '15px'}}
                        onClick={props.pointsHandler}
                    >
                        Points
                    </button>
                    <button
                        style={{padding: '10px 15px', background: 'transparent', cursor: 'pointer'}}
                        onClick={props.circlesHandler}
                    >
                        Circles
                    </button>
                </div>
            </div>
        </>
    );
};

export default CanvasComponent;