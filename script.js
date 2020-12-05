const slider = document.getElementById("mv-slider")
const sliderSwitch = document.getElementById("mv-slider-switch")
const modelViewer = document.querySelector('#mv-model');
const playButton = document.getElementById("play")
const pauseButton = document.getElementById("pause")

sliderSwitch.props = {
    active: false,
    xPos: 0
}

controls = {
    override: false
}

sliderSwitch.addEventListener("mousedown", (e) => { sliderSwitch.props.active = true; })
slider.addEventListener("mousedown", (e) => { sliderSwitch.props.active = true; })
sliderSwitch.addEventListener("touchstart", (e) => { sliderSwitch.props.active = true; })
slider.addEventListener("touchstart", (e) => { sliderSwitch.props.active = true; })

pauseButton.addEventListener("click", (e) => {
    if (modelViewer.pause) {
        controls.override = true;
        modelViewer.pause()
    }
})

playButton.addEventListener("click", (e) => {
    controls.override = false;
    sliderSwitch.props.active = false
    if (modelViewer.play){ 
        modelViewer.play()
    }
})

window.addEventListener("mouseup", (e) => {endInteractionHandler(e)})
window.addEventListener("touchend", (e) => {endInteractionHandler(e)})

function endInteractionHandler(e){
    sliderSwitch.props.active = false

    if (!controls.override){
        if (modelViewer.play) {
            modelViewer.play();
        }
    }
}

function moveHandler(e){
    mousePosition.x = e.pageX;
    mousePosition.y = e.pageY;
}

const mousePosition = {
    x: 0,
    y: 0
}

window.addEventListener("mousemove", (e) => { moveHandler(e) })
window.addEventListener("touchmove", (e) => { moveHandler(e) })



const duration = 5;

function tick(timestamp) {
    const relativeMousePosition = mousePosition.x - slider.getBoundingClientRect().left
    const currentTime = modelViewer.currentTime;
    const maxWidth = slider.getBoundingClientRect().width;

    if (sliderSwitch.props.active && modelViewer.pause) { 
        modelViewer.pause();
        let switchPosition = toValidSwitchPosition(relativeMousePosition - (sliderSwitch.getBoundingClientRect().width / 2))
        modelViewer.currentTime = switchPosition/maxWidth * duration
        sliderSwitch.style.backgroundColor = "#555";
        sliderSwitch.style.transform = 'translateX(' + switchPosition + 'px)';
        
    } else { 

        let switchPosition = toValidSwitchPosition(maxWidth / duration * currentTime)
        sliderSwitch.style.backgroundColor = "#000"
        sliderSwitch.style.transform = 'translateX(' + switchPosition + 'px)';
    }
    
    // `Math.min()` is used here to make sure that the element stops at exactly 200px.
    
    window.requestAnimationFrame(tick);
}

function toValidSwitchPosition(switchPosition){
    const minBound = 0
    const maxBound = slider.getBoundingClientRect().width - sliderSwitch.getBoundingClientRect().width
    if(switchPosition < minBound) return minBound
    if(switchPosition > maxBound) return maxBound
    return switchPosition
}

window.requestAnimationFrame(tick);