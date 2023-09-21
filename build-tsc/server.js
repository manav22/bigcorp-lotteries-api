"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var cors = require('cors');
var redis = require('redis');
var ulid = require('ulid');
var REDIS_URL = process.env.REDIS_URL;
var client = redis.createClient({ url: REDIS_URL });
var app = express();
var port = 3000;
// This is going to write any Redis error to console.
client.on('error', function (error) {
    console.error(error);
});
if (process.env.NODE_ENV === 'development') {
    console.log('running in development environment');
    // Enabling Cross-Origin Resource Sharing in development, as we run
    // the frontend and the backend code on different ports while developing.
    app.use(cors());
}
app.use(express.json({ limit: '10kb' }));
app.get('/', function (req, res) {
    // Send an empty object as the response.
    res.json({});
});
app.post('/lotteries', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, name, prize, id, newLottery, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, type = _a.type, name = _a.name, prize = _a.prize;
                if (type !== 'simple') {
                    res.status(422).json({ error: 'Invalid lottery type' });
                    return [2 /*return*/];
                }
                if (typeof name !== 'string' || name.length < 3) {
                    res.status(422).json({ error: 'Invalid lottery name' });
                    return [2 /*return*/];
                }
                if (typeof prize !== 'string' || prize.length < 3) {
                    res.status(422).json({ error: 'Invalid lottery prize' });
                    return [2 /*return*/];
                }
                id = ulid.ulid();
                newLottery = {
                    id: id,
                    name: name,
                    prize: prize,
                    type: type,
                    status: 'running',
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, client.connect()];
            case 2:
                _b.sent();
                return [4 /*yield*/, client
                        .multi()
                        .hSet("lottery.".concat(id), newLottery)
                        .lPush('lotteries', id)
                        .exec()];
            case 3:
                _b.sent();
                return [4 /*yield*/, client.disconnect()];
            case 4:
                _b.sent();
                console.log('res', res);
                res.json(newLottery);
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error(error_1);
                res.status(500).json({ error: 'Failed to create lottery' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var requiredFieldId, requiredFieldName, _a, id, name, lotteryStatus, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                requiredFieldId = 'id';
                requiredFieldName = 'name';
                _a = req.body, id = _a.id, name = _a.name;
                console.log('body for register', req, req.body, id, name);
                // return res.status(200).json({id, name});
                if (!id) {
                    res
                        .status(400)
                        .json({ error: "Missing required field: ".concat(requiredFieldId) });
                    return [2 /*return*/];
                }
                if (!name) {
                    res
                        .status(400)
                        .json({ error: "Missing required field: ".concat(requiredFieldName) });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, client.hGet("lottery.".concat(id), 'status')];
            case 2:
                lotteryStatus = _b.sent();
                if (!lotteryStatus) {
                    throw new Error("A lottery with the given ID doesn't exist");
                }
                if (lotteryStatus === 'finished') {
                    throw new Error('A lottery with the given ID is already finished');
                }
                return [4 /*yield*/, client.lPush("lottery.".concat(id, ".participants"), name)];
            case 3:
                _b.sent();
                res.json({ status: 'Success' });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                if (error_2 instanceof Error) {
                    console.error(error_2);
                    res.status(500).json({
                        error: "Failed to register for the lottery: ".concat(error_2.message),
                    });
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get('/lotteries/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loterryId, lottery, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loterryId = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 7]);
                return [4 /*yield*/, client.connect()];
            case 2:
                _a.sent();
                return [4 /*yield*/, client.hGetAll("lottery.".concat(loterryId))];
            case 3:
                lottery = _a.sent();
                if (!Object.keys(lottery).length) {
                    res
                        .status(404)
                        .json({ error: 'A lottery with the given ID does not exist' });
                    return [2 /*return*/];
                }
                res.json(lottery);
                return [3 /*break*/, 7];
            case 4:
                error_3 = _a.sent();
                console.error(error_3);
                res.status(500).json({ error: 'Failed to create lottery' });
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, client.disconnect()];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); });
app.get('/lotteries', function (req, res, res1) { return __awaiter(void 0, void 0, void 0, function () {
    var allLotteries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAllLotteries(res1)];
            case 1:
                allLotteries = _a.sent();
                res.json(allLotteries);
                return [2 /*return*/];
        }
    });
}); });
function getAllLotteries(res) {
    return __awaiter(this, void 0, void 0, function () {
        var lotteries, lotteryIds, transaction_1, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 7]);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.lRange('lotteries', 0, -1)];
                case 2:
                    lotteryIds = _a.sent();
                    transaction_1 = client.multi();
                    lotteryIds.forEach(function (id) { return transaction_1.hGetAll("lottery.".concat(id)); });
                    return [4 /*yield*/, transaction_1.exec()];
                case 3:
                    lotteries = _a.sent();
                    return [2 /*return*/, lotteries];
                case 4:
                    error_4 = _a.sent();
                    console.error(error_4);
                    res.status(500).json({ error: 'Failed to read the lotteries data' });
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, client.disconnect()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/, []];
            }
        });
    });
}
if (process.env.NODE_ENV === 'production') {
    // Serving the bundled frontend code together with the backend on the same port in production.
    console.log('running in production environment');
    app.use(express.static('client/dist'));
}
app.listen(port, function () {
    console.log("Server listening on port ".concat(port));
});
