"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const webPath = 'www';
function main() {
    const app = (0, express_1.default)();
    app.use(express_1.default.static(path_1.default.resolve(webPath)));
    app.get('*', (req, res) => res.sendFile(path_1.default.resolve(webPath, 'index.html')));
    app.listen(9993);
    console.log(9993);
}
main();
//# sourceMappingURL=dev.js.map