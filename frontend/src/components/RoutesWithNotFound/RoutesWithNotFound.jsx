import { Routes, Route, Navigate } from "react-router-dom";

//components
import { NotFound } from "../";

export const RoutesWithNotFound = ({ children }) => {
  return (
    <Routes>
      {children}
      <Route path="*" element={<Navigate to="/NotFound" />} />
      <Route path="/NotFound" element={<NotFound />} />
    </Routes>
  );
};
