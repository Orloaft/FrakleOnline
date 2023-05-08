import { createContext } from "react";

type actionRequest = (req: any) => void;

const UpdateContext = createContext<actionRequest | null>(null);

export default UpdateContext;
