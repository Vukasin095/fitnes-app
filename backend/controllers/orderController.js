import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc Fetch all orders
// @route POST /api/orders 
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400);
        throw new Error('Nema porudžbina');
    }
    else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                category: x.category || 'Proizvod',
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }

});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Porudžbina nije pronađena');
    }
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer?.email_address
        };

        const isMembershipOrder = order.orderItems.some(
            (item) => item.category === 'Članarine'
        );

        if (isMembershipOrder) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            
            const membershipItem = order.orderItems.find((i) => i.category === 'Članarine');
            let days = 30; // default
            try {
                if (membershipItem && membershipItem.product) {
                    const prod = await Product.findById(membershipItem.product);
                    if (prod && typeof prod.countInStock === 'number') {
                        days = prod.countInStock;
                    }
                }
            } catch (err) {
                // ignore and use default
            }

            const start = new Date();
            const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
            order.membershipStartDate = start;
            order.membershipEndDate = end;

            const user = await User.findById(req.user._id);
            if (user) {
                user.isMember = true;
                await user.save();
            }
        }

        for (const item of order.orderItems) {
            if (item.category === 'Članarine') {
                continue;
            }

            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock = Math.max(
                    0,
                    product.countInStock - item.qty
                );
                await product.save();
            }
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    }
    else {
        res.status(404);
        throw new Error('Porudžbina nije pronađena');
    }
});

// @desc Mark order as paid and delivered
// @route PUT /api/orders/:id/pay-deliver
// @access Private/Admin
const updateOrderToPaidAndDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.paymentResult = {
            id: req.body.id || 'gym-reception',
            status: req.body.status || 'COMPLETED',
            update_time: req.body.update_time || new Date().toISOString(),
            email_address: req.body.payer?.email_address || req.user?.email,
        };

        const isMembershipOrder = order.orderItems.some(
            (item) => item.category === 'Članarine'
        );

        if (isMembershipOrder) {
            const membershipItem = order.orderItems.find((i) => i.category === 'Članarine');
            let days = 30;
            try {
                if (membershipItem && membershipItem.product) {
                    const prod = await Product.findById(membershipItem.product);
                    if (prod && typeof prod.countInStock === 'number') {
                        days = prod.countInStock;
                    }
                }
            } catch (err) {
                // use default duration
            }

            const start = new Date();
            const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
            order.membershipStartDate = start;
            order.membershipEndDate = end;

            const user = await User.findById(order.user);
            if (user) {
                user.isMember = true;
                await user.save();
            }
        }

        for (const item of order.orderItems) {
            if (item.category === 'Članarine') {
                continue;
            }

            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock = Math.max(0, product.countInStock - item.qty);
                await product.save();
            }
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Porudžbina nije pronađena');
    }
});

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    }
    else {
        res.status(404);
        throw new Error('Porudžbina nije pronađena');
    }
});

// @desc Get all orders
// @route GET /api/orders 
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});

// @desc Update order membership dates (admin only)
// @route PUT /api/orders/:id/membership-dates
// @access Private/Admin
const updateOrderMembershipDates = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        if (req.body.membershipStartDate) {
            order.membershipStartDate = new Date(req.body.membershipStartDate);
        }
        if (req.body.membershipEndDate) {
            order.membershipEndDate = new Date(req.body.membershipEndDate);
        }
        const updatedOrder = await order.save();

        // If membership end date is in the past, normally we'd sync the user's isMember flag.
        // However, when admin explicitly cancels a membership by setting the end date to epoch (0),
        // we should NOT flip the user's `isMember` to false so the account remains marked as
        // activated at the reception (and falls into CASE B on the profile). Only update the
        // user's isMember for non-epoch dates.
        try {
            if (updatedOrder.membershipEndDate) {
                const endTime = new Date(updatedOrder.membershipEndDate).getTime();
                const user = await User.findById(updatedOrder.user);
                if (user) {
                    if (endTime === 0) {
                        // admin cancellation: do not change user.isMember
                    } else {
                        user.isMember = true;
                        await user.save();
                    }
                }
            }
        } catch (err) {
            // ignore user update errors
        }

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Porudžbina nije pronađena');
    }
});

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToPaidAndDelivered, updateOrderToDelivered, getOrders, updateOrderMembershipDates };