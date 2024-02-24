import "./DeleteModal.css";

const DeleteModal = ({ isOpen, onClose, onDelete, children }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <div className="delete-modal-header">Confirm Deletion</div>
        <div className="delete-modal-body">{children}</div>
        <div className="delete-modal-actions">
          <button className="delete-modal-button" onClick={onDelete}>
            Delete
          </button>
          <button className="delete-modal-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
