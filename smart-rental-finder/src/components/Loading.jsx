import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import '../styles/common.css';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <AiOutlineLoading3Quarters className="loading-icon" />
      <p>{message}</p>
    </div>
  );
};

export default Loading;
