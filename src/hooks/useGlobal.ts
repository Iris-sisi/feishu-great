import React from "react";
import { useTableData } from "./useTableData";

// @ts-expect-error
export const GlobalContext = React.createContext<ReturnType<typeof useTableData>>({});