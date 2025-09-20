import React, { createContext, useContext } from "react";
import { Alert } from "react-native";

export const AuthContextList = createContext<{ onOpen: () => void }>({
  onOpen: () => {},
});

export const AuthProviderList: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const onOpen = () =>
    Alert.alert("Log", "Abrir fluxo de novo treino (placeholder)");
  return (
    <AuthContextList.Provider value={{ onOpen }}>
      {children}
    </AuthContextList.Provider>
  );
};

export const useAuth = () => useContext(AuthContextList);
