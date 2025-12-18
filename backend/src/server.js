"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const socket_1 = __importDefault(require("./socket/socket"));
const databaseConfig_1 = __importDefault(require("./config/databaseConfig"));
const port = process.env.PORT || 3000;
(0, databaseConfig_1.default)();
socket_1.default.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
