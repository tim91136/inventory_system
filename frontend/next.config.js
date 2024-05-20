/** @type {import('next').NextConfig} */

function validateEnv() {
    const requiredEnvVariables = ['INVENTORY_API_URL'] //'SERVER_URL']
    requiredEnvVariables.forEach((varName) => {
        if (!process.env[varName]) {
            console.warn(`[WARNING] Environment variable ${varName} is missing: \n\n ENV ${JSON.stringify(process.env)}`)
        } else {
            console.log(`[ENVIRONMENT] Variable: ${varName} is set to ${process.env[varName]}`)
        }
    })
    
  }
  validateEnv()

const nextConfig = {
    env: {
        INVENTORY_API_URL: process.env.INVENTORY_API_URL,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    async redirects() {
        let redirects = [
            {
                source: '/auth/logout',
                destination: '/inventory_api/auth/logout',
                permanent: false,
            },
        ]
        return redirects
    },
    async rewrites() {
        return [
            {
                source: '/inventory_api/:path*',  // This matches all requests starting with /inventory_api/
                destination: `${process.env.INVENTORY_API_URL}/:path*`,  // Proxy these requests to your Flask backend
            }
        ];
    }
}

validateEnv()


const isProduction = process.env.NODE_ENV === 'production'
console.log(`[ENVIRONMENT] Production: ${isProduction}`)

module.exports = nextConfig
