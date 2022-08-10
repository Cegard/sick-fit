import { cloudinaryImage } from '@keystone-next/cloudinary';
import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, permissions } from '../access';

export const cloudinary = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: 'sickfits',
};

export const ProductImage = list({
    acces: {
        create: isSignedIn,
        read: () => true,
        update: permissions.canManageProducts,
        delete: permissions.canManageProducts,
    },
    fields: {
        image: cloudinaryImage({
            cloudinary,
            label: 'Source',
        }),
        altText: text(),
        product: relationship({ ref: 'Product.image' }),
    },
    ui: {
        listView: {
            initialColumns: ['image', 'altText', 'product'],
        },
    },
});
