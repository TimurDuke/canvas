import React, {useEffect, useRef, useState} from 'react';

const draw = (context, color, x, y, size, angle, fill) => {
    if (fill) {
        context.fillStyle = color;
        context.fill();
    } else {
        context.strokeStyle = color;
        context.stroke();
    }

    context.beginPath();
    context.arc(x, y, size, 0, angle, true);
    context.closePath();

    const imageData = context.createImageData(1, 1);
    context.putImageData(imageData, x, y);
};

const App = () => {
    const [pixels, setPixels] = useState([]);

    const [state, setState] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    const [options, setOptions] = useState({
        color: '#000000',
        size: 5,
        circles: false,
        points: true,
    });

    const ws = useRef(null);
    const canvas = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/drawer");

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({type: "GET_ALL_PIXELS"}));
        };

        ws.current.onmessage = event => {
            const decodedMessage = JSON.parse(event?.data);

            switch (decodedMessage.type) {
                case 'NEW_PIXEL':
                    return setPixels(pixels => [...pixels, ...decodedMessage.newPixels]);
                case 'ALL_PIXELS':
                    return setPixels(pixels => [...pixels, ...decodedMessage['pixels']]);
                default:
                    console.log("Unknown message type: ", decodedMessage.type);
            }
        };

        return () => ws.current.close();
    }, []);

    useEffect(() => {
        pixels.forEach(pixel => {
            const context = canvas.current.getContext('2d');

            if (pixel.circles) {
                draw(context, pixel.color, pixel.x, pixel.y, pixel.size, (Math.PI / 180) * 360);
            } else if (pixel.points) {
                draw(context, pixel.color, pixel.x, pixel.y, pixel.size, Math.PI * 2, true);
            }
        });
    }, [pixels]);

    const canvasMouseMoveHandler = event => {
        const x = event.clientX;
        const y = event.clientY;

        if (state.mouseDown && options.points) {
            setState(prev => ({
                ...prev,
                pixelsArray: [...prev.pixelsArray, {
                    x,
                    y,
                    color: options.color,
                    size: options.size,
                    points: true,
                }]
            }));

            const context = canvas.current.getContext('2d');

            draw(context, options.color, x, y, options.size, Math.PI * 2, true);
        } else if (state.mouseDown && options.circles) {
            setState(prev => ({
                ...prev,
                pixelsArray: [...prev.pixelsArray, {
                    x,
                    y,
                    color: options.color,
                    size: options.size,
                    circles: true,
                }]
            }));

            const context = canvas.current.getContext('2d');

            draw(context, options.color, x, y, options.size, (Math.PI / 180) * 360);
        }
    };

    const mouseDownHandler = () => {
        setState({...state, mouseDown: true});
    };

    const mouseUpHandler = () => {
        ws.current.send(JSON.stringify({
            type: "CREATE_PIXELS",
            newPixels: [...state.pixelsArray]
        }));
        setState({...state, mouseDown: false, pixelsArray: []});
    };

    return (
        <>
            <div>
                ku
            </div>
        </>
    );
};

export default App;