import { FastifyRequest, FastifyReply } from "fastify";
import chalk from "chalk";
import { env } from "../env";

const methodColor = chalk.cyan;
const urlColor = chalk.white;
const ipColor = chalk.yellow;
const timeColor = chalk.magenta;

function colorStatus(status: number) {
    if (status >= 500) return chalk.red;
    if (status >= 400) return chalk.yellow;
    if (status >= 300) return chalk.blue;
    if (status >= 200) return chalk.green;
    return chalk.white;
}

function formatLogMessage({
    method,
    fullUrl,
    ip,
    status,
    duration,
}: {
    method: string;
    fullUrl: string;
    ip: string;
    status: number;
    duration: number;
}) {
    return `{${methodColor(method)}} ${urlColor(fullUrl)} - Client IP: ${ipColor(ip)} - Status: ${colorStatus(status)(status.toString())} - ${timeColor(duration + 'ms')}`;
}

export async function loggingHook(request: FastifyRequest, reply: FastifyReply) {
    if (env.NODE_ENV !== 'dev') return;

    const startTime = parseInt(request.headers['x-start-time'] as string, 10) || Date.now();
    const duration = Date.now() - startTime;

    const protocol = request.headers['x-forwarded-proto'] || 'http';
    const host = request.headers.host || 'localhost:3000';
    const fullUrl = `${protocol}://${host}${request.url}`;
    const method = request.method;
    const ip = request.ip;
    const status = reply.statusCode;

    console.log(formatLogMessage({ method, fullUrl, ip, status, duration }));
}
