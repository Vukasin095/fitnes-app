import express from "express";
const router = express.Router();
import {
    addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToPaidAndDelivered, updateOrderToDelivered, getOrders, updateOrderMembershipDates
} from
    "../controllers/orderController.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/pay-deliver").put(protect, admin, updateOrderToPaidAndDelivered);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/:id/membership-dates").put(protect, admin, updateOrderMembershipDates);
export default router;
