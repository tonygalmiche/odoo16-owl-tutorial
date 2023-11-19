/** @odoo-module */
import { registry } from "@web/core/registry";
import { memoize } from "@web/core/utils/functions";

export const TestMemoizeService = {
    dependencies: ["orm"],
    async: ["loadRes"],
    start(env, { orm }) {
        return {
            loadRes: memoize(() => orm.call("res.partner", 'test_memoize_action', [])),
        };
    }
};
registry.category("services").add("TestMemoizeService", TestMemoizeService);
