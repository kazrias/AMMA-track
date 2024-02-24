import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1>Oops! Page not found.</h1>
      <p>We couldn't find the page you were looking for.</p>
      <Link to="/">Go back</Link>
    </div>
  );
}

export default NotFound;