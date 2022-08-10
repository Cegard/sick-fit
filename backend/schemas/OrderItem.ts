import { integer, relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const OrderItem = list({
    access: {
        create: isSignedIn,
        read: rules.canManageOrderItems,
        update: () => false,
        delete: () => false,
    },
    fields: {
        name: text({ isRequired: true }),
        description: text({
            ui: {
                displayMode: 'textarea',
            },
        }),
        price: integer(),
        image: relationship({
            ref: 'ProductImage',
            ui: {
                displayMode: 'cards',
                cardFields: ['image', 'altText'],
                inlineCreate: { fields: ['image', 'altText'] },
                inlineEdit: { fields: ['image', 'altText'] },
            },
        }),
        quantity: integer(),
        order: relationship({ ref: 'Order.items' }),
    },
});
