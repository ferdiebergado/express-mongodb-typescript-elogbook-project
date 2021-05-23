/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
export class TokenException extends Error {
    constructor(public message: string = 'Invalid token.') {
        super();
    }
}
