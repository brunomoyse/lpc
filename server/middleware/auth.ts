import { H3Event } from "h3";
import { JwtPayload, verify } from "jsonwebtoken";
import { parse } from "graphql";
import { readBody } from "h3";
const config = useRuntimeConfig();

const checkIfLoginMutation = async (event: H3Event):Promise<Boolean> => {
    const body = await readBody(event);
    const query: string = body.query;
    const document = parse(query);

    const operation = document.definitions.find(
        (definition) => definition.kind === "OperationDefinition"
    );
    let operationType = null;
    let operationName = null;
    if (operation && "operation" in operation) {
        operationType = operation && operation.operation;
    }
    if (operation && "name" in operation) {
        operationName = operation && operation.name && operation.name.value;
    }

    // Check if the operation is the login mutation
    return operationType === "mutation" && operationName === "LoginUser";
}

const verifyToken = (event: H3Event) : void => {
    // get the token sent in the headers
    const headers = event.node.req.headers;
    if (headers.authorization) {
        const token = headers.authorization.split(" ")[1];

        try {
            const jwtPayload: string | JwtPayload = verify(
                token,
                config.private.appSecret
            );
            if (typeof jwtPayload === 'object') {
                const currentUser = jwtPayload.user;
                event.context.auth = {currentUser};
            } else {
                throw new Error("Invalid token");
            }
        } catch (error: any) {
            if (error.message === 'jwt expired') {
                throw new Error("Token expired");
            }
            console.log('custom error:', error.message)
        }
    }

    //// get the token in the cookies
    //const access_token = getCookie(event, "access-token");
    //if (access_token) {
    //    const jwtPayload: string | JwtPayload = verify(
    //        access_token,
    //        config.private.appSecret
    //    );
    //    if (typeof jwtPayload === 'object') {
    //        const currentUser = jwtPayload.user;
    //        event.context.auth = {currentUser};
    //    } else {
    //        throw new Error("Invalid token");
    //    }
    //} else {
    //    throw new Error("No token providedxx");
    //}
}

export default defineEventHandler(async (event: H3Event) => {
    if (event.node.req.url === '/logout') {
        deleteCookie(event, 'access-token');
        deleteCookie(event, 'refresh-token');
    }
    if (event.node.req.url === "/api/graphql" || event.node.req.url === "/login") {
        const isLoginMutation = await checkIfLoginMutation(event);
        if (!isLoginMutation && event.node.req.url !== "/login") {
            verifyToken(event);
        }
    } else {
        verifyToken(event);
    }
});
