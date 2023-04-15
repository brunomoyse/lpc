import { H3Event } from "h3";
import { JwtPayload, verify } from "jsonwebtoken";
import { parse } from "graphql";
import { readBody } from "h3";
import { getCookie } from "h3";
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

const verifyToken = (event: H3Event) => {
    const access_token = getCookie(event, "access-token");
    if (access_token) {
        const jwtPayload: string | JwtPayload = verify(
            access_token,
            config.private.appSecret
        );
        if (typeof jwtPayload === 'object') {
            const currentUserId = jwtPayload.userId;
            event.context.auth = {currentUserId};
        }
    } else {
        throw new Error("No token provided");
    }
}

export default defineEventHandler(async (event: H3Event) => {
    if (event.node.req.url !== "/login" ) {
        if (event.node.req.url === "/api/graphql") {
            const isLoginMutation = await checkIfLoginMutation(event);
            if (!isLoginMutation) {
                verifyToken(event);
            }
        } else {
            verifyToken(event);
        }
    }
});
