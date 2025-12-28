"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/books', router_1.default);
const MONGO = "mongodb://127.0.0.1:27017/altBookTracker";
mongoose_1.default.connect(MONGO).then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log(`🚀 Server on http://localhost:5000`));
}).catch(err => {
    console.error('❌ MongoDB error:', err?.message || err);
});
