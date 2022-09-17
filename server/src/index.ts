import Fastify from 'fastify'
import FastifyCookie from '@fastify/cookie'
import FastifySession from '@fastify/session'
import FastifyCORS from '@fastify/cors'

/**
 * Whether the program is running in production (final) mode.
 */
const production = process.env['NODE_ENV'] === 'production'

const CORS_DOMAIN = process.env['CORS_DOMAIN'] || 'localhost'

/**
 * The port that the server is running on.
 */
const PORT: number = parseInt(process.env['PORT'] ?? '3000', 10)

const defaultCookieSecret = 'a secret with minimum length of 32 characters'
const COOKIE_SECRET = process.env['COOKIE_SECRET'] || defaultCookieSecret

if (COOKIE_SECRET === defaultCookieSecret) {
	console.warn('default cookie secret used, consider providing a custom one')
}

/**
 * The main Fastify program.
 */
const program = Fastify({
	logger: true,
	trustProxy: true,
})

// use cookie parser
program.register(FastifyCookie)
// retain session data between requests
program.register(FastifySession, {
	secret: COOKIE_SECRET,
	cookie: {
		secure: production,
		httpOnly: true,
		path: '/',
		maxAge: 24 * 60 * 60 * 1000, // 24h
	},
})

// allow for cross-site requests
program.register(FastifyCORS, {
	origin: new RegExp(CORS_DOMAIN),
	credentials: true,
	preflight: true,
})

// testing request to verify the server is working
program.get('/', async (_, response): Promise<{ hello: string }> => {
	response.status(200)
	return { hello: 'world' }
})

// routers

/**
 * Runs the main program.
 */
const start = async () => {
	try {
		await program.listen({
			host: '0.0.0.0',
			port: PORT,
		})
	} catch (err) {
		program.log.error(err)
		process.exit(1)
	}
}

start()
