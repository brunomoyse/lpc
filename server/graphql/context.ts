// server/graphql/context.ts
import {H3Event} from "h3";

export interface MyContext<T = {}> {
    event: H3Event;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    // ...other properties
}
