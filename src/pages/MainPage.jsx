import { Info } from "../components/Info/Info"
import { Footer } from "../components/Footer/Footer"

import { useSelector } from "react-redux"

import { Navigate } from "react-router-dom"


const MainPage = () => {
  const user = useSelector((state) => state.auth.loggedUser);

  if (user.id) {
    return <Navigate to="/workspaces" />;
  }
  return (
    <>
      <Info />
      <Footer />
    </>
  )

}

export default MainPage