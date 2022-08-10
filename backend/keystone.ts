import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
    withItemData,
    statelessSessions,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { ProductImage } from './schemas/ProductImages';
import { CartItem } from './schemas/CartItem';
import { Role } from './schemas/Role';
import { insertSeedData } from './seed-data';
import { sendPasswordResetFunction } from './lib/mail';
import { extendGraphQLSchemaExtension } from './mutations';
import { permissionsList } from './schemas/fields';

const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360,
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
    },
    passwordResetLink: {
        sendToken: async (args) => {
            await sendPasswordResetFunction(args.token, args.identity);
        },
    },
});

export default withAuth(
    config({
        server: {
            cors: {
                origin: [process.env.FRONTEND_URL],
                credentials: true,
            },
        },
        db: {
            adapter: 'mongoose',
            url: databaseURL,
            async onConnect(keystone) {
                if (process.argv.includes('--seed-data'))
                    await insertSeedData(keystone);
            },
        },
        lists: createSchema({
            User,
            Product,
            ProductImage,
            CartItem,
            OrderItem,
            Order,
            Role,
        }),
        extendGraphqlSchema: extendGraphQLSchemaExtension,
        ui: {
            isAccessAllowed: ({ session }) => session?.data,
        },
        session: withItemData(statelessSessions(sessionConfig), {
            User: `id name email role { ${permissionsList.join(' ')}}`,
        }),
    })
);
