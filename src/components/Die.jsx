
export default function Die(props) {

    const dots = [];
    for(let i=0; i<props.value; i++) {
        dots.push(<h2 className="dot" key={i}>⚫</h2>)
    }
  
    return (
        <div onClick = {props.hold} className= {props.isHeld ? 'die die-green' : 'die die-white'}>
           {dots}
        </div>
    )
    
}