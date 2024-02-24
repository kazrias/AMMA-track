import TodoListCard from "./TodoListCards";

import { useRef, useEffect, useState } from "react";

import { ListLoading } from "../ListLoading/ListLoading.jsx";

import { useDispatch } from "react-redux";
import { updateLists } from "../../redux/slices/todosSlice.js";
import { updateCardOrder } from "../../redux/slices/cardsSlice.js";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const TodoListContainer = ({
  lists,
  cards,
  activeListId,
  handleSetActiveList,
  handleRemoveList,
  handleRemoveCard,
  handleAddCard,
  newCardText,
  setNewCardText,
  boardId,
  isLoading,
  setCardModal,
  setCardId
}) => {

  const elementRef = useRef(null);
  const [elementWidth, setElementWidth] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  useEffect(() => {
    // Get the width of the element
    setElementWidth(() => { let curr = elementRef?.current?.offsetWidth; return curr })
    setViewportWidth(() => { let curr = window.innerWidth; return curr })

  }, [isLoading]);
  const dispatch = useDispatch();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    if (result.type === "LIST") {

      const updatedLists = Array.from(lists);
      const [removed] = updatedLists.splice(result.source.index, 1);
      updatedLists.splice(result.destination.index, 0, removed);
      dispatch(updateLists(updatedLists));

    } else if (result.type === "CARD") {
      const sourceListId = result.source.droppableId;
      const destinationListId = result.destination.droppableId;

      if (sourceListId === destinationListId) {

        const sourceList = Array.isArray(cards[sourceListId])
          ? [...cards[sourceListId]]
          : [];
        const [removed] = sourceList.splice(result.source.index, 1);
        sourceList.splice(result.destination.index, 0, removed);
        dispatch(
          updateCardOrder({ listId: sourceListId, updatedCards: sourceList })
        );
      } else {
        const sourceList = Array.isArray(cards[sourceListId])
          ? [...cards[sourceListId]]
          : [];
        const destinationList = Array.isArray(cards[destinationListId])
          ? [...cards[destinationListId]]
          : [];
        const [movedCard] = sourceList.splice(result.source.index, 1);
        destinationList.splice(result.destination.index, 0, movedCard);
        dispatch(
          updateCardOrder({ listId: sourceListId, updatedCards: sourceList })
        );
        dispatch(
          updateCardOrder({
            listId: destinationListId,
            updatedCards: destinationList
          })
        );
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="containerList containerClass">
          <ListLoading />
        </div>
      ) : !lists.length ? (
        <div className="containerList containerClass"><p className="containerClass-text">Add your first list!</p></div>
      ) : (

        <div ref={elementRef} style={elementWidth > viewportWidth ? { overflowX: "scroll"} : {width:'100%'}} className="wrapper">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="todo-lists"
              direction="horizontal"
              type="LIST"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}

                  className={`containerList ${elementWidth > viewportWidth ? '--content' : ''}`}
                >
                  {lists.map((list, index) => (
                    <Draggable
                      key={list.id}
                      draggableId={list.id}
                      index={index}
                      type="LIST"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TodoListCard
                            key={list.id}
                            list={list}
                            activeListId={activeListId}
                            handleSetActiveList={handleSetActiveList}
                            handleRemoveList={handleRemoveList}
                            handleRemoveCard={handleRemoveCard}
                            handleAddCard={handleAddCard}
                            newCardText={newCardText}
                            setNewCardText={setNewCardText}
                            cards={cards[list.id]}
                            index={index}
                            setCardModal={setCardModal} 
                            setCardId={setCardId}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div >
      )}
    </>
  );
};

export default TodoListContainer;
