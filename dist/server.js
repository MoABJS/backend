"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.get("/", (req, res) => {
    res.send("Hello there...");
});
exports.app.listen(3000, () => {
    console.log("server is running on port 3000");
});
