import { KeystoneContext } from '@keystone-next/types';
import {
    CartItemCreateInput,
    OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

export default async function checkout(
    root: any,
    { token }: { token: string },
    context: KeystoneContext
): Promise<OrderCreateInput> {
    const userId = context.session.itemId;

    if (!userId) {
        throw new Error('You must to be logged in to do this!');
    }

    const user = await context.lists.User.findOne({
        where: { id: userId },
        resolveFields: `
            id
            name
            email
            cart {
                id
                quantity
                product {
                    id
                    product
                    name
                    description
                    price
                    image {
                        id
                        image {
                            id
                            publicUrlTransformed
                        }
                    }
                }
            }
        `,
    });

    const cartItems = user.cart.filter(
        (item: CartItemCreateInput) => item.product
    ) as CartItemCreateInput[];
    const total = cartItems.reduce(
        (accounted: number, item: CartItemCreateInput) =>
            accounted + item.quantity * item.product.price,
        0
    );

    const charge = await stripeConfig.paymentIntents
        .create({
            amount: total,
            currency: 'USD',
            confirm: true,
            payment_method: token,
        })
        .catch((error) => {
            throw new Error(error.message);
        });

    const orderItems = cartItems.map((cartItem) => ({
        name: cartItem.product.name,
        description: cartItem.product.description,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        image: { connect: { id: cartItem.product.image.id } },
    }));

    const order = await context.lists.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems },
            user: { connect: { id: userId } },
        },
    });
    const cartItemIds = user.cart.map((item) => item.id);
    await context.lists.CartItem.deleteMany({
        ids: cartItemIds,
    });

    return order;
}
