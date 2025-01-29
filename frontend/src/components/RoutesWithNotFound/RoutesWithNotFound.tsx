import React, { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NotFound } from "..";

interface Props {
  children: ReactNode;
}

export const RoutesWithNotFound = ({ children }: Props) => {
  return (
    <Routes>
      {children}
      <Route path="*" element={<Navigate to="/NotFound" />} />
      <Route path="/NotFound" element={<NotFound />} />
    </Routes>
  );
};
