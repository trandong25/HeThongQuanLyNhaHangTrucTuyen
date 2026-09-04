import { createContext } from "react";

export const MyUserContext = createContext([null, () => {}]);
export const CartContext = createContext([{}, () => {}]);