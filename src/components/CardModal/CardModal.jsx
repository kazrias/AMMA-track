import './CardModal.css'

import CardDescription from './CardDescription';

import logo from "../../images/amma-truck-logo.png"

import { useSelector } from 'react-redux'; 

function CardModal({ cardID, setCardModal, setCardId }) {
    const path = window.location.href.split("/");
    const boardId = path[path.length - 1];
    const boardImage  = useSelector((state) => state.boards.boards).filter((board) => board.id === boardId)[0]?.img?.thumb;

    const closeCardModal = () => {
        document.body.style.overflowY = "scroll";
        setCardModal(() => false);
        setCardId(() => "")
    }
    return (
        <div id="card-modal-block" onClick={() => closeCardModal()} style={{backgroundImage:  `url(${boardImage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
            <div className="card-modal-header" onClick={(e) => e.stopPropagation()}>
                <div className="card-header">
                    <h3 className="card-header-title">
                        <a href="/" className="st-logo-card-modal">
                            <img src={logo} alt="AMMA-TRACK"/>
                            AMMA-Track
                        </a>
                    </h3>
                    <button onClick={() => closeCardModal()} className='close-card-modal-btn'><i className="fa-solid fa-xmark"></i></button>
                </div>
            </div>
            <div className="card-modal" onClick={(e) => e.stopPropagation() }> 
                <CardDescription cardID={cardID} setCardModal={setCardModal} setCardId={setCardId}/>
            </div>
        </div>
    )
}

export default CardModal;