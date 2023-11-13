"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Transaction_routes_1 = __importDefault(require("./Public/Transaction.routes"));
const Vendor_routes_1 = __importDefault(require("./Public/Vendor.routes"));
const Meter_routes_1 = __importDefault(require("./Public/Meter.routes"));
const PowerUnit_routes_1 = __importDefault(require("./Public/PowerUnit.routes"));
const User_routes_1 = __importDefault(require("./Public/User.routes"));
const Auth_routes_1 = __importDefault(require("./Public/Auth.routes"));
const router = (0, express_1.Router)();
router
    .use('/transaction', Transaction_routes_1.default)
    .use('/vendor', Vendor_routes_1.default)
    .use('/meter', Meter_routes_1.default)
    .use('/powerunit', PowerUnit_routes_1.default)
    .use('/user', User_routes_1.default)
    .use('/auth', Auth_routes_1.default);
exports.default = router;
