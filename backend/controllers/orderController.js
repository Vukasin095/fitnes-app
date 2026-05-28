import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

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
        const isMembershipOrder = orderItems.some((x) => x.isMembership);

        const order = new Order({
            orderItems: orderItems.map((x) => ({
                name: x.name,
                qty: x.qty,
                image: x.image,
                price: x.price,
                isMembership: x.isMembership || false,
                product: x.product || x._id || x.id || x.name,
            })),
            user: req.user._id,
            shippingAddress: shippingAddress || {},
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            status: isMembershipOrder ? 'Plaćeno' : 'Processing',
            isPaid: isMembershipOrder,
            paidAt: isMembershipOrder ? Date.now() : undefined,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }

});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
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
        if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
            res.status(200).json(order);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Porudžbina nije pronađena');
    }
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
});

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
});

// @desc Get all orders
// @route GET /api/orders 
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
});

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders };