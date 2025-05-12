/* eslint-disable react/prop-types */
import {
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";

const icons = {
  info: <AiOutlineInfoCircle />,
  success: <AiOutlineCheckCircle />,
  warning: <AiOutlineWarning />,
  error: <AiOutlineCloseCircle />,
};

const Notification = ({ type = "info", message, onClose }) => {
  return (
    <div className={`notification ${type}`}>
      {/* icon */}
      {icons[type]}
      {/* message */}
      <p>{message}</p>
      {/* close button */}
      <AiOutlineClose onClick={onClose} className="closeBtn" />
    </div>
  );
};

export default Notification;
