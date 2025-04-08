import {fileURLToPath} from 'url'
import { dirname,resolve } from 'path';
import { config } from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains: [
            'lh3.googleusercontent.com',
            'res.cloudinary.com',
            'upload.wikimedia.org',
            'cdn.pixabay.com'
        ],
    },
    experimental:{
        serverComponentsExternalPackages: ['mongoose']
    },
    env:{
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dvytyf3nn",
        NEXT_PUBLIC_CLOUDINARY_PRESET_NAME: "ml_default",
    },
    webpack: (config) =>{
        config.resolve.alias['@'] = resolve(__dirname);
        config.resolve.alias["@utils"] = resolve(__dirname, "utils");
        config.resolve.alias["@/utils/models"] = resolve(__dirname, "utils/models");
        // config.resolve.alias["@/utils/db"] = resolve(__dirname, "utils/db");
        // config.resolve.alias["@/utils/middleware"] = resolve(__dirname, "utils/middleware");
        // config.resolve.alias["@/utils/middleware/auth"] = resolve(__dirname, "utils/middleware/auth");
        // config.resolve.alias["@/utils/middleware/verifyToken"] = resolve(__dirname, "utils/middleware/verifyToken");
        // config.resolve.alias["@/utils/middleware/verifyToken.js"] = resolve(__dirname, "utils/middleware/verifyToken.js");
        return config;
    },
    async headers(){
        return[
            {
                source: "/(.*)",
                headers:[
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-Requested-With, Authorization, Content-Type",
                    },
                ],
            },
        ];
    }

};

export default nextConfig;
