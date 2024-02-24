import { Droppable, Draggable } from 'react-beautiful-dnd';

const TodoListCard = ({
  list,
  activeListId,
  handleSetActiveList,
  handleRemoveList,
  handleRemoveCard,
  handleAddCard,
  newCardText,
  setNewCardText,
  cards,
  setCardModal,
  setCardId
}) => {
  const openCardModal = (cardID, setCardModal, setCardId) => {
    document.body.style.overflowY = "hidden";
    setCardModal(() => true);
    setCardId(() => cardID)
  }

  return (
    <div className={`list ${activeListId === list.id ? 'active' : ''}`} onClick={() => handleSetActiveList(list.id)}>
      <div className="list-title-X">
        <h3>{list.title}</h3>
        <button onClick={() => handleRemoveList(list.id)}><i className="fa-solid fa-x"></i></button>
      </div>
      <Droppable droppableId={list.id} type="CARD">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards &&
              cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}  type="CARD">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="delete-card"
                    >
                      <li className="card">
                        {card.text}
                        <div className="card-buttons">
                          <button onClick={() => openCardModal(card.id, setCardModal, setCardId)} className="open-card-modal-button">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button onClick={() => handleRemoveCard(list.id, card.id)}><i className="fa-solid fa-x"></i></button>
                        </div>
                      </li>
                    </div>
                  )}
                </Draggable>
              ))}
          </ul>
        )}
      </Droppable>
      {activeListId === list.id && (
        <form onSubmit={handleAddCard}>
          <div className='add-card'>
            <input
              type="text"
              placeholder="Enter a title for this card..."
              value={newCardText}
              onChange={e => setNewCardText(e.target.value)}
            />
            <button type="submit" >Add card</button>
          </div>
        </form>
      )}
    </div>
  );
};
export default TodoListCard;