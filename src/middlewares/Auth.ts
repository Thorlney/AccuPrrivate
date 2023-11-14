import { AuthToken, TokenUtil } from "../utils/Auth/token";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../utils/Constants";
import { IPartner } from "../models/Partner.model";
import { UnauthenticatedError } from "../utils/Errors";
import Cypher from "../utils/Cypher";

export const basicAuth = function (tokenType: AuthToken) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer'))
            return next(new Error('Invalid authorization header'));

        const jwtToken = authHeader.split(' ')[1];
        const payload = jwt.verify(jwtToken, JWT_SECRET) as string;

        const tokenData = payload as unknown as {
            partner: IPartner,
            misc: Record<string, any>,
            token: string
        }
        tokenData.token = jwtToken

        if (tokenData.misc.tokenType !== tokenType) {
            return next(new UnauthenticatedError('Invalid authentication'))
        }

        const key = `${tokenType}_token:${tokenData.partner.id}`;
        const token = await TokenUtil.getTokenFromCache(key);
        if (token !== jwtToken) {
            return next(new UnauthenticatedError('Invalid authentication'))
        }

        (req as any).user = tokenData

        next()
    }
}

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string
    const apiSecret = req.headers['x-api-secret'] as string
    if (!apiKey) {
        return next(new UnauthenticatedError('Invalid API key'))
    }

    console.log({
        apiKey,
        apiSecret,
    })

    const decryptedStr = Cypher.decryptString(apiKey).replace(/"/g, '')
    const encryptedSecretForDecodingApiKey = await TokenUtil.getTokenFromCache(apiSecret)
    console.log({
        apiKey,
        apiSecret,
        decreyptedApiKey: decryptedStr,
        encryptedSecretForDecodingApiKey,
    })
    if (!encryptedSecretForDecodingApiKey) {
        return next(new UnauthenticatedError('Invalid API Secret'))
    }

    const decryptedEncryptedSecretForDecodingApiKey = Cypher.decryptString(encryptedSecretForDecodingApiKey).replace(/"/g, '')

    console.log({
        apiKey,
        apiSecret,
        decreyptedApiKey: decryptedStr,
        encryptedSecretForDecodingApiKey,
        decryptedEncryptedSecretForDecodingApiKey
    })
    const validApiKey = Cypher.decodeApiKey(apiKey, decryptedEncryptedSecretForDecodingApiKey)
    console.log({
        apiKey,
        apiSecret,
        decreyptedApiKey: decryptedStr,
        encryptedSecretForDecodingApiKey,
        decryptedEncryptedSecretForDecodingApiKey,
    })
    if (!validApiKey) {
        return next(new UnauthenticatedError('Invalid API key'))
    }

    (req as any).key = validApiKey

    next()
}