import { registerAs } from '@nestjs/config';

export const ENV_VARIABLES = process.env as any;

export default registerAs('cloudinary', () => ({
    cloud_name: ENV_VARIABLES.CLOUDINARY_API_NAME,
    api_key: ENV_VARIABLES.CLOUDINARY_API_KEY,
    api_secret: ENV_VARIABLES.CLOUDINARY_API_SECRET,
    secure: true,
}));
