"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.9.1",
    "engineVersion": "e922089b7d7502aff4249d5da3420f6fa55fc6ad",
    "activeProvider": "postgresql",
    "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel user {\n  user_id       String    @id @default(uuid())\n  username      String    @unique\n  email         String    @unique\n  password_hash String?\n  full_name     String\n  phone         String?\n  age           Int?\n  gender        String?\n  height        Float?\n  weight        Float?\n  bmi           Decimal   @default(0) @db.Decimal(10, 2)\n  birthday      DateTime?\n  is_active     Boolean   @default(true)\n  created_at    DateTime  @default(now())\n  updated_at    DateTime  @updatedAt\n\n  budget_daily   Decimal @default(0) @db.Decimal(10, 2)\n  budget_weekly  Decimal @default(0) @db.Decimal(10, 2)\n  budget_monthly Decimal @default(0) @db.Decimal(10, 2)\n\n  calories_per_day      Int                  @default(0)\n  daily_target_calories Int                  @default(0)\n  activity_level        users_activity_level\n  liked_foods           Json?\n  preferred_food_types  Json?\n  health_goals_list     Json?\n  google_id             String?              @unique\n  is_email_verified     Boolean              @default(false)\n}\n\nenum users_activity_level {\n  SEDENTARY\n  LIGHT_1_3\n  MODERATE_3_5\n  ACTIVE_6_7\n  VERY_ACTIVE\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"user\":{\"fields\":[{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password_hash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"full_name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"age\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"gender\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"height\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"weight\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"bmi\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"birthday\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"is_active\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"budget_daily\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"budget_weekly\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"budget_monthly\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"calories_per_day\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"daily_target_calories\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"activity_level\",\"kind\":\"enum\",\"type\":\"users_activity_level\"},{\"name\":\"liked_foods\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"preferred_food_types\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"health_goals_list\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"google_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"is_email_verified\",\"kind\":\"scalar\",\"type\":\"Boolean\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"user.findUnique\",\"user.findUniqueOrThrow\",\"orderBy\",\"cursor\",\"user.findFirst\",\"user.findFirstOrThrow\",\"user.findMany\",\"data\",\"user.createOne\",\"user.createMany\",\"user.createManyAndReturn\",\"user.updateOne\",\"user.updateMany\",\"user.updateManyAndReturn\",\"create\",\"update\",\"user.upsertOne\",\"user.deleteOne\",\"user.deleteMany\",\"having\",\"_count\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"user.groupBy\",\"user.aggregate\",\"AND\",\"OR\",\"NOT\",\"user_id\",\"username\",\"email\",\"password_hash\",\"full_name\",\"phone\",\"age\",\"gender\",\"height\",\"weight\",\"bmi\",\"birthday\",\"is_active\",\"created_at\",\"updated_at\",\"budget_daily\",\"budget_weekly\",\"budget_monthly\",\"calories_per_day\",\"daily_target_calories\",\"users_activity_level\",\"activity_level\",\"liked_foods\",\"preferred_food_types\",\"health_goals_list\",\"google_id\",\"is_email_verified\",\"equals\",\"string_contains\",\"string_starts_with\",\"string_ends_with\",\"array_starts_with\",\"array_ends_with\",\"array_contains\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"in\",\"notIn\",\"contains\",\"startsWith\",\"endsWith\",\"set\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "VwsQHRwAADwAMB0AAAQAEB4AADwAMB8BAAAAASABAAAAASEBAAAAASIBAD4AISMBAD0AISQBAD4AISUCAD8AISYBAD4AIScIAEAAISgIAEAAISkQAEEAISpAAEIAISsgAEMAISxAAEQAIS1AAEQAIS4QAEEAIS8QAEEAITAQAEEAITECAEUAITICAEUAITQAAEY0IjUAAEcAIDYAAEcAIDcAAEcAIDgBAAAAATkgAEMAIQEAAAABACABAAAAAQAgHRwAADwAMB0AAAQAEB4AADwAMB8BAD0AISABAD0AISEBAD0AISIBAD4AISMBAD0AISQBAD4AISUCAD8AISYBAD4AIScIAEAAISgIAEAAISkQAEEAISpAAEIAISsgAEMAISxAAEQAIS1AAEQAIS4QAEEAIS8QAEEAITAQAEEAITECAEUAITICAEUAITQAAEY0IjUAAEcAIDYAAEcAIDcAAEcAIDgBAD4AITkgAEMAIQsiAABIACAkAABIACAlAABIACAmAABIACAnAABIACAoAABIACAqAABIACA1AABIACA2AABIACA3AABIACA4AABIACADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAaHwEAAAABIAEAAAABIQEAAAABIgEAAAABIwEAAAABJAEAAAABJQIAAAABJgEAAAABJwgAAAABKAgAAAABKRAAAAABKkAAAAABKyAAAAABLEAAAAABLUAAAAABLhAAAAABLxAAAAABMBAAAAABMQIAAAABMgIAAAABNAAAADQCNYAAAAABNoAAAAABN4AAAAABOAEAAAABOSAAAAABAQgAAAkAIBofAQAAAAEgAQAAAAEhAQAAAAEiAQAAAAEjAQAAAAEkAQAAAAElAgAAAAEmAQAAAAEnCAAAAAEoCAAAAAEpEAAAAAEqQAAAAAErIAAAAAEsQAAAAAEtQAAAAAEuEAAAAAEvEAAAAAEwEAAAAAExAgAAAAEyAgAAAAE0AAAANAI1gAAAAAE2gAAAAAE3gAAAAAE4AQAAAAE5IAAAAAEBCAAACwAwAQgAAAsAMBofAQBOACEgAQBOACEhAQBOACEiAQBPACEjAQBOACEkAQBPACElAgBQACEmAQBPACEnCABRACEoCABRACEpEABSACEqQABTACErIABUACEsQABVACEtQABVACEuEABSACEvEABSACEwEABSACExAgBWACEyAgBWACE0AABXNCI1gAAAAAE2gAAAAAE3gAAAAAE4AQBPACE5IABUACECAAAAAQAgCAAADgAgGh8BAE4AISABAE4AISEBAE4AISIBAE8AISMBAE4AISQBAE8AISUCAFAAISYBAE8AIScIAFEAISgIAFEAISkQAFIAISpAAFMAISsgAFQAISxAAFUAIS1AAFUAIS4QAFIAIS8QAFIAITAQAFIAITECAFYAITICAFYAITQAAFc0IjWAAAAAATaAAAAAATeAAAAAATgBAE8AITkgAFQAIQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgEBUAAEkAIBYAAEoAIBcAAE0AIBgAAEwAIBkAAEsAICIAAEgAICQAAEgAICUAAEgAICYAAEgAICcAAEgAICgAAEgAICoAAEgAIDUAAEgAIDYAAEgAIDcAAEgAIDgAAEgAIB0cAAAaADAdAAAXABAeAAAaADAfAQAbACEgAQAbACEhAQAbACEiAQAcACEjAQAbACEkAQAcACElAgAdACEmAQAcACEnCAAeACEoCAAeACEpEAAfACEqQAAgACErIAAhACEsQAAiACEtQAAiACEuEAAfACEvEAAfACEwEAAfACExAgAjACEyAgAjACE0AAAkNCI1AAAlACA2AAAlACA3AAAlACA4AQAcACE5IAAhACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIB0cAAAaADAdAAAXABAeAAAaADAfAQAbACEgAQAbACEhAQAbACEiAQAcACEjAQAbACEkAQAcACElAgAdACEmAQAcACEnCAAeACEoCAAeACEpEAAfACEqQAAgACErIAAhACEsQAAiACEtQAAiACEuEAAfACEvEAAfACEwEAAfACExAgAjACEyAgAjACE0AAAkNCI1AAAlACA2AAAlACA3AAAlACA4AQAcACE5IAAhACEOFQAAKQAgGAAAOwAgGQAAOwAgOgEAAAABQQEAAAABQgEAAAABQwEAAAABRAEAAAABRQEAOgAhRgEAAAAERwEAAAAESAEAAAABSQEAAAABSgEAAAABDhUAACYAIBgAADkAIBkAADkA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-gAAAAAE_gAAAAAFAgAAAAAFBgAAAAAFCgAAAAAFDgAAAAAFEgAAAAAFFgAAAAAEAAAAAAAABSwEAAAABAUsBAAAAAQVLAgAAAAFMAgAAAAFNAgAAAAFOAgAAAAFPAgAAAAEFSwgAAAABTAgAAAABTQgAAAABTggAAAABTwgAAAABBUsQAAAAAUwQAAAAAU0QAAAAAU4QAAAAAU8QAAAAAQFLQAAAAAEBSyAAAAABAUtAAAAAAQVLAgAAAAFMAgAAAAFNAgAAAAFOAgAAAAFPAgAAAAEBSwAAADQCAAAAAAUVAAYWAAcXAAgYAAkZAAoAAAAAAAUVAAYWAAcXAAgYAAkZAAoBAgECAwEFBgEGBwEHCAEJCgEKDAILDQMMDwENEQIOEgQREwESFAETFQIaGAUbGQs"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map